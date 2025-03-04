import React, { ReactNode, ReactPortal, AriaAttributes } from 'react';
import invariant from 'invariant';
import { globalObject } from '@skbkontur/global-object';
import debounce from 'lodash.debounce';

import {
  isKeyArrowDown,
  isKeyArrowUp,
  isKeyArrowVertical,
  isKeyEnter,
  isKeyEscape,
  isKeySpace,
} from '../../lib/events/keyboard/identifiers';
import { locale } from '../../lib/locale/decorators';
import { reactGetTextContent } from '../../lib/reactGetTextContent';
import { Button, ButtonProps, ButtonUse } from '../Button';
import { DropdownContainer, DropdownContainerProps } from '../../internal/DropdownContainer';
import { filterProps } from '../../lib/filterProps';
import { Input } from '../Input';
import { Menu } from '../../internal/Menu';
import { MenuItem, MenuItemProps } from '../MenuItem';
import { MenuSeparator } from '../MenuSeparator';
import { RenderLayer } from '../../internal/RenderLayer';
import { createPropsGetter } from '../../lib/createPropsGetter';
import { Nullable } from '../../typings/utility-types';
import { getRandomID, isFunction, isNonNullable, isReactUINode } from '../../lib/utils';
import { ThemeContext } from '../../lib/theming/ThemeContext';
import { Theme } from '../../lib/theming/Theme';
import { CommonProps, CommonWrapper } from '../../internal/CommonWrapper';
import { ArrowChevronDownIcon } from '../../internal/icons/16px';
import { MobilePopup } from '../../internal/MobilePopup';
import { cx } from '../../lib/theming/Emotion';
import { responsiveLayout } from '../ResponsiveLayout/decorator';
import { getRootNode, rootNode, TSetRootNode } from '../../lib/rootNode';
import { isTheme2022 } from '../../lib/theming/ThemeHelpers';
import { ThemeFactory } from '../../lib/theming/ThemeFactory';
import { MenuHeaderProps } from '../MenuHeader';
import { SizeProp } from '../../lib/types/props';
import {
  getFullReactUIFlagsContext,
  ReactUIFeatureFlags,
  ReactUIFeatureFlagsContext,
} from '../../lib/featureFlagsContext';

import { ArrowDownIcon } from './ArrowDownIcon';
import { Item } from './Item';
import { SelectLocale, SelectLocaleHelper } from './locale';
import { styles } from './Select.styles';
import { getSelectTheme } from './selectTheme';

export interface ButtonParams
  extends Pick<AriaAttributes, 'aria-describedby' | 'aria-controls' | 'aria-label' | 'aria-expanded'> {
  disabled?: boolean;
  label: React.ReactNode;
  onClick: () => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => void;
  opened: boolean;
  isPlaceholder: boolean;
  size: SizeProp;
}

const PASS_BUTTON_PROPS = {
  disabled: true,
  error: true,
  use: true,
  size: true,
  warning: true,

  onMouseEnter: true,
  onMouseLeave: true,
  onMouseOver: true,
};

export const SelectDataTids = {
  root: 'Select__root',
  menu: 'Select__menu',
  label: 'Select__label',
} as const;

export const SelectIds = {
  menu: SelectDataTids.menu,
} as const;

type SelectItem<TValue, TItem> =
  | [TValue, TItem, React.ReactNode?]
  | TItem
  | TValue
  | React.ReactElement
  | (() => React.ReactElement);

export interface SelectProps<TValue, TItem>
  extends CommonProps,
    Pick<DropdownContainerProps, 'menuPos'>,
    Pick<AriaAttributes, 'aria-describedby' | 'aria-label'> {
  /** @ignore */
  _icon?: React.ReactNode;
  /** @ignore */
  _renderButton?: (params: ButtonParams) => React.ReactNode;
  defaultValue?: TValue;
  /**
   * Отключает использование портала
   */
  disablePortal?: boolean;
  disabled?: boolean;
  /**
   * Состояние валидации при ошибке.
   */
  error?: boolean;
  filterItem?: (value: TValue, item: TItem, pattern: string) => boolean;
  /**
   * Набор значений. Поддерживаются любые перечисляемые типы, в том числе
   * `Array`, `Map`, `Immutable.Map`.
   *
   * Элементы воспринимаются следующим образом: если элемент — это массив, то
   * первый элемент является значением, второй — отображается в списке,
   * а третий – комментарий;
   * если элемент не является массивом, то он используется и для отображения,
   * и для значения.
   *
   * Для вставки разделителя можно использовать `Select.SEP`.
   *
   * Вставить невыделяемый элемент со своей разметкой можно так:
   * ```
   * <Select ...
   *   items={[Select.static(() => <div>My Element</div>)]}
   * />
   * ```
   *
   * Чтобы добавить стандартный отступ для статического элемента:
   * ```
   * <Select.Item>My Element</Select.Item>
   * ```
   */
  items?: Array<SelectItem<TValue, TItem>>;
  maxMenuHeight?: number;
  maxWidth?: React.CSSProperties['maxWidth'];
  menuAlign?: 'left' | 'right';
  menuWidth?: React.CSSProperties['width'];
  onValueChange?: (value: TValue) => void;
  onClose?: () => void;
  onMouseEnter?: (e: React.MouseEvent<HTMLElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLElement>) => void;
  onMouseOver?: (e: React.MouseEvent<HTMLElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLElement>) => void;
  onOpen?: () => void;
  placeholder?: React.ReactNode;
  /**
   * Функция для отрисовки элемента в выпадающем списке. Аргументы — *value*,
   * *item*.
   */
  renderItem?: (value: TValue, item?: TItem) => React.ReactNode;
  /**
   * Функция для отрисовки выбранного элемента. Аргументы — *value*, *item*.
   */
  renderValue?: (value: TValue, item?: TItem) => React.ReactNode;
  /**
   * Функция для сравнения `value` с элементом из `items`
   */
  areValuesEqual?: (value1: TValue, value2: TValue) => boolean;
  /**
   * Показывать строку поиска в списке.
   */
  search?: boolean;
  value?: TValue;
  width?: number | string;
  /**
   * Состояние валидации при предупреждении.
   */
  warning?: boolean;
  use?: ButtonUse;
  size?: SizeProp;
  onFocus?: React.FocusEventHandler<HTMLElement>;
  onBlur?: React.FocusEventHandler<HTMLElement>;
  /**
   * Текст заголовка выпадающего меню в мобильной версии
   */
  mobileMenuHeaderText?: string;
}

export interface SelectState<TValue> {
  opened: boolean;
  searchPattern: string;
  value: Nullable<TValue>;
}

interface FocusableReactElement extends React.ReactElement<any> {
  focus: (event?: any) => void;
}

type DefaultProps<TValue, TItem> = Required<
  Pick<SelectProps<TValue, TItem>, 'renderValue' | 'renderItem' | 'areValuesEqual' | 'filterItem' | 'use' | 'size'>
>;

@responsiveLayout
@rootNode
@locale('Select', SelectLocaleHelper)
// Suggested solutions break current behavior
// eslint-disable-next-line @typescript-eslint/ban-types
export class Select<TValue = {}, TItem = {}> extends React.Component<SelectProps<TValue, TItem>, SelectState<TValue>> {
  public static __KONTUR_REACT_UI__ = 'Select';
  public static displayName = 'Select';

  public static defaultProps: DefaultProps<unknown, ReactNode | ReactPortal> = {
    renderValue,
    renderItem,
    areValuesEqual,
    filterItem,
    use: 'default',
    size: 'small',
  };

  public static Item = Item;
  public static SEP = () => <MenuSeparator />;

  public static static = (element: React.ReactElement | (() => React.ReactElement)) => {
    invariant(
      React.isValidElement(element) || typeof element === 'function',
      'Select.static(element) expects element to be a valid react element.',
    );
    return element;
  };

  public state: SelectState<TValue> = {
    opened: false,
    value: this.props.defaultValue,
    searchPattern: '',
  };

  private theme!: Theme;
  private isMobileLayout!: boolean;
  private readonly locale!: SelectLocale;
  private menu: Nullable<Menu>;
  private menuId = SelectIds.menu + getRandomID();
  private buttonElement: FocusableReactElement | null = null;
  private getProps = createPropsGetter(Select.defaultProps);
  private setRootNode!: TSetRootNode;
  private featureFlags!: ReactUIFeatureFlags;

  public componentDidUpdate(_prevProps: SelectProps<TValue, TItem>, prevState: SelectState<TValue>) {
    if (!prevState.opened && this.state.opened) {
      globalObject.addEventListener?.('popstate', this.close);
    }
    if (prevState.opened && !this.state.opened) {
      globalObject.removeEventListener?.('popstate', this.close);
    }
  }

  public render() {
    return (
      <ReactUIFeatureFlagsContext.Consumer>
        {(flags) => {
          this.featureFlags = getFullReactUIFlagsContext(flags);
          return (
            <ThemeContext.Consumer>
              {(theme) => {
                this.theme = ThemeFactory.create(
                  {
                    menuOffsetY: theme.selectMenuOffsetY,
                  },
                  theme,
                );
                return <ThemeContext.Provider value={this.theme}>{this.renderMain()}</ThemeContext.Provider>;
              }}
            </ThemeContext.Consumer>
          );
        }}
      </ReactUIFeatureFlagsContext.Consumer>
    );
  }

  /**
   * @public
   */
  public open = () => {
    if (!this.state.opened) {
      this.setState({ opened: true });

      if (this.props.onOpen) {
        this.props.onOpen();
      }
    }
  };

  /**
   * @public
   */
  public close = () => {
    if (this.state.opened) {
      this.setState({ opened: false, searchPattern: '' });

      if (this.props.onClose) {
        this.props.onClose();
      }
    }
  };

  /**
   * @public
   */
  public focus = () => {
    if (this.buttonElement && this.buttonElement.focus) {
      this.buttonElement.focus();
    }
  };

  private getMenuRenderer() {
    if (this.props.disabled) {
      return null;
    }

    if (this.isMobileLayout) {
      return this.renderMobileMenu();
    }

    if (this.state.opened) {
      return this.renderMenu();
    }

    return null;
  }

  private renderMain() {
    const buttonParams = this.getDefaultButtonParams();
    const button = (
      <ThemeContext.Provider value={getSelectTheme(this.theme, this.props)}>
        {this.getButton(buttonParams)}
      </ThemeContext.Provider>
    );

    const isMobile = this.isMobileLayout;

    const style = {
      width: this.props.width,
      maxWidth: this.props.maxWidth || undefined,
    };

    const root = (
      <span
        data-tid={SelectDataTids.root}
        className={cx({ [styles.root()]: true, [styles.rootMobile(this.theme)]: isMobile })}
        style={style}
      >
        {button}
        {this.getMenuRenderer()}
      </span>
    );

    return (
      <CommonWrapper rootNodeRef={this.setRootNode} {...this.props}>
        <RenderLayer
          onClickOutside={this.close}
          onFocusOutside={this.close}
          active={isMobile ? false : this.state.opened}
        >
          {root}
        </RenderLayer>
      </CommonWrapper>
    );
  }

  private getDefaultButtonParams = (): ButtonParams => {
    const { label, isPlaceholder } = this.renderLabel();

    const buttonParams: ButtonParams = {
      opened: this.state.opened,
      label,
      isPlaceholder,
      onClick: this.toggle,
      onKeyDown: this.handleKey,
      size: this.getProps().size,
      disabled: this.getProps().disabled,
    };

    return buttonParams;
  };

  private renderLabel() {
    const value = this.getValue();
    const item = this.getItemByValue(value);

    if (isNonNullable(value)) {
      return {
        label: this.getProps().renderValue(value, item),
        isPlaceholder: false,
      };
    }

    return {
      label: <span>{this.props.placeholder || this.locale?.placeholder}</span>,
      isPlaceholder: true,
    };
  }

  private getLeftIconClass(size: SizeProp | undefined) {
    if (this.getProps().use === 'link') {
      return styles.leftIconLink(this.theme);
    }

    switch (size) {
      case 'large':
        return styles.leftIconLarge(this.theme);
      case 'medium':
        return styles.leftIconMedium(this.theme);
      case 'small':
      default:
        return styles.leftIconSmall(this.theme);
    }
  }

  private renderDefaultButton(params: ButtonParams) {
    const buttonProps: ButtonProps = {
      ...filterProps(this.props, PASS_BUTTON_PROPS),
      align: 'left' as React.CSSProperties['textAlign'],
      disabled: this.props.disabled,
      width: '100%',
      onClick: params.onClick,
      onKeyDown: params.onKeyDown,
      active: params.opened,
      size: params.size,
    };
    const use = this.getProps().use;

    const labelProps = {
      'data-tid': SelectDataTids.label,
      className: cx({
        [styles.label()]: use !== 'link',
        [styles.placeholder(this.theme)]: params.isPlaceholder,
        [styles.customUsePlaceholder()]: params.isPlaceholder && use !== 'default',
        [styles.placeholderDisabled(this.theme)]: params.isPlaceholder && this.props.disabled,
      }),
      style: {
        paddingRight: this.getSelectIconGap(),
      },
    };

    const useIsCustom = use !== 'default';

    const icon = isTheme2022(this.theme) ? <ArrowDownIcon size={this.props.size} /> : <ArrowChevronDownIcon />;

    return (
      <Button {...buttonProps}>
        <div className={styles.selectButtonContainer()}>
          {this.props._icon && <div className={this.getLeftIconClass(this.props.size)}>{this.props._icon}</div>}
          <span {...labelProps}>{params.label}</span>

          <div
            className={cx(styles.arrowWrap(this.theme), {
              [styles.arrowDisabled(this.theme)]: this.props.disabled,
              [styles.customUseArrow()]: useIsCustom,
            })}
          >
            {icon}
          </div>
        </div>
      </Button>
    );
  }

  private getSelectIconGap(): number {
    const getArrowPadding = () => {
      switch (this.props.size) {
        case 'large':
          return this.theme.selectIconGapLarge;
        case 'medium':
          return this.theme.selectIconGapMedium;
        case 'small':
        default:
          return this.theme.selectIconGapSmall;
      }
    };
    const arrowLeftPadding = parseFloat(getArrowPadding()) || 0;

    return arrowLeftPadding;
  }

  private renderMenu(): React.ReactNode {
    const search = this.props.search ? this.getSearch() : null;

    const value = this.getValue();
    const hasFixedWidth = !!this.props.menuWidth && this.props.menuWidth !== 'auto';

    return (
      <DropdownContainer
        id={this.menuId}
        data-tid={SelectDataTids.menu}
        getParent={this.dropdownContainerGetParent}
        align={this.props.menuAlign}
        disablePortal={this.props.disablePortal}
        hasFixedWidth={hasFixedWidth}
        menuPos={this.props.menuPos}
      >
        <Menu
          ref={this.refMenu}
          width={this.props.menuWidth}
          onItemClick={this.close}
          maxHeight={this.props.maxMenuHeight}
          align={this.props.menuAlign}
        >
          {search}
          {this.getMenuItems(value)}
        </Menu>
      </DropdownContainer>
    );
  }

  private getSearch = () => {
    return (
      <div className={styles.search()} onKeyDown={this.handleKey}>
        <Input ref={this.debouncedFocusInput} onValueChange={this.handleSearch} width="100%" />
      </div>
    );
  };

  private renderMobileMenu(): React.ReactNode {
    const search = this.props.search ? this.getMobileSearch() : null;
    const value = this.getValue();

    return (
      <MobilePopup
        headerChildComponent={search}
        caption={this.props.mobileMenuHeaderText}
        onCloseRequest={this.close}
        opened={this.state.opened}
      >
        <Menu hasShadow={false} onItemClick={this.close} disableScrollContainer maxHeight={'auto'}>
          {this.getMenuItems(value)}
        </Menu>
      </MobilePopup>
    );
  }

  private getMobileSearch = () => {
    return (
      <Input
        autoFocus
        value={this.state.searchPattern}
        ref={this.debouncedFocusInput}
        onValueChange={this.handleSearch}
        width="100%"
      />
    );
  };

  private getMenuItems = (value: Nullable<TValue>) => {
    const isMobile = this.isMobileLayout;
    const size = this.props.size;

    return this.mapItems(
      (iValue: TValue, item: TItem | (() => React.ReactNode), i: number, comment: Nullable<React.ReactNode>) => {
        if (isFunction(item)) {
          const element = item();

          if (React.isValidElement(element)) {
            return React.cloneElement(element, { key: i, isMobile, size });
          }

          return null;
        }

        if (React.isValidElement(item)) {
          if (isReactUINode('MenuItem', item)) {
            return React.cloneElement(item, { key: i, isMobile, size } as MenuItemProps);
          }
          if (isReactUINode('MenuHeader', item)) {
            return React.cloneElement(item, { size } as MenuHeaderProps);
          }
          return React.cloneElement(item, { key: i });
        }

        return (
          <MenuItem
            key={i}
            state={this.areValuesEqual(iValue, value) ? 'selected' : null}
            onClick={this.select.bind(this, iValue)}
            comment={comment}
            isMobile={isMobile}
            size={this.props.size}
          >
            {this.getProps().renderItem(iValue, item)}
          </MenuItem>
        );
      },
    );
  };

  private dropdownContainerGetParent = () => {
    return getRootNode(this);
  };

  // fix cases when an Input is rendered in portal
  // https://github.com/skbkontur/retail-ui/issues/1995
  private focusInput = (input: Input) => input?.focus();
  private debouncedFocusInput = debounce(this.focusInput);

  private refMenu = (menu: Menu) => {
    this.menu = menu;
  };

  private toggle = () => {
    if (this.state.opened) {
      this.close();
    } else {
      this.open();
    }
  };

  private handleKey = (e: React.KeyboardEvent<HTMLElement>) => {
    if (!this.state.opened) {
      if (isKeySpace(e) || isKeyArrowVertical(e)) {
        e.preventDefault();
        this.open();
      }
    } else {
      switch (true) {
        case isKeyEscape(e):
          this.focus();
          this.close();
          break;
        case isKeyArrowUp(e):
          e.preventDefault();
          if (this.menu) {
            this.menu.up();
          }
          break;
        case isKeyArrowDown(e):
          e.preventDefault();
          if (this.menu) {
            this.menu.down();
          }
          break;
        case isKeyEnter(e):
          e.preventDefault(); // To prevent form submission.
          if (this.menu) {
            this.menu.enter(e);
          }
          break;
      }
    }
    if (this.props.onKeyDown) {
      this.props.onKeyDown(e);
    }
  };

  private handleSearch = (value: string) => {
    const menuItemsAtAnyLevel = this.featureFlags.menuItemsAtAnyLevel;

    this.setState({ searchPattern: value });
    this.menu?.highlightItem(menuItemsAtAnyLevel ? 0 : 1);
  };

  private select(value: TValue) {
    this.focus();
    this.setState({ opened: false, value });

    if (!this.areValuesEqual(this.getValue(), value)) {
      this.props.onValueChange?.(value);
    }
  }

  private getValue() {
    if (this.props.value !== undefined) {
      return this.props.value;
    }
    return this.state.value;
  }

  private mapItems(fn: (value: TValue, item: TItem, index: number, comment?: string) => React.ReactNode) {
    const { items } = this.props;
    if (!items) {
      return [];
    }
    const pattern = this.state.searchPattern && this.state.searchPattern.toLowerCase();

    const result: React.ReactNode[] = [];
    let index = 0;
    for (const entry of items) {
      const [value, item, comment] = normalizeEntry(entry as TItem);

      if (!pattern || this.getProps().filterItem(value, item, pattern)) {
        result.push(fn(value, item, index, comment));
        ++index;
      }
    }

    return result;
  }

  private getItemByValue(value?: Nullable<TValue>) {
    if (value === null || value === undefined) {
      return null;
    }

    const items = this.props.items || [];

    for (const entry of items) {
      const [itemValue, item] = normalizeEntry(entry);

      if (this.areValuesEqual(itemValue, value)) {
        return item;
      }
    }
    return null;
  }

  private areValuesEqual(value1: Nullable<TValue>, value2: Nullable<TValue>) {
    return isNonNullable(value1) && isNonNullable(value2) && this.getProps().areValuesEqual(value1, value2);
  }

  private buttonRef = (element: FocusableReactElement | null) => {
    this.buttonElement = element;
  };

  private getButton = (buttonParams: ButtonParams) => {
    const button = this.props._renderButton
      ? this.props._renderButton(buttonParams)
      : this.renderDefaultButton(buttonParams);

    const buttonElement = React.Children.only(button);

    return React.isValidElement(buttonElement)
      ? React.cloneElement(buttonElement as React.ReactElement, {
          ref: this.buttonRef,
          onFocus: this.props.onFocus,
          onBlur: this.props.onBlur,
          size: this.props.size,
          'aria-describedby': this.props['aria-describedby'],
          'aria-expanded': this.state.opened ? 'true' : 'false',
          'aria-controls': this.menuId,
          'aria-label': buttonElement.props['aria-label'] ?? this.props['aria-label'],
        })
      : buttonElement;
  };
}

function renderValue<TValue, TItem>(value: TValue, item: Nullable<TItem>) {
  return item;
}

function renderItem<TValue, TItem>(value: TValue, item?: TItem) {
  return item;
}

function areValuesEqual<TValue>(value1: TValue, value2: TValue) {
  return value1 === value2;
}

function normalizeEntry(entry: any) {
  if (Array.isArray(entry)) {
    return entry;
  }

  return [entry, entry, undefined];
}

const getTextFromItem = (item: any): string => {
  if (typeof item === 'string') {
    return item;
  }

  if (isFunction(item)) {
    return getTextFromItem(item());
  }

  if (React.isValidElement(item)) {
    return reactGetTextContent(item);
  }

  if (typeof item === 'number') {
    return item.toString(10);
  }

  return '';
};

function filterItem<TValue>(value: TValue, item: any, pattern: string) {
  if (item === Select.SEP) {
    return false;
  }

  const itemText = getTextFromItem(item);

  if (!itemText) {
    return false;
  }

  return itemText.toLowerCase().indexOf(pattern) !== -1;
}
