// TODO: Rewrite stories and enable rule (in process of functional refactoring).
/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import { action } from '@storybook/addon-actions';
import BabyIcon from '@skbkontur/react-icons/Baby';
import SearchIcon from '@skbkontur/react-icons/Search';

import { Meta, Story } from '../../../typings/stories';
import { ComboBox, ComboBoxProps } from '../ComboBox';
import { MenuItem, MenuItemState } from '../../MenuItem';
import { MenuSeparator } from '../../MenuSeparator';
import { Nullable } from '../../../typings/utility-types';
import { Toggle } from '../../Toggle';
import { Button, ButtonDataTids } from '../../Button';
import { Gapped } from '../../Gapped';
import { MenuHeader } from '../../MenuHeader';
import { delay, mergeRefs } from '../../../lib/utils';
import { Tooltip } from '../../Tooltip';
import { rootNode, TSetRootNode } from '../../../lib/rootNode';
import { ReactUIFeatureFlagsContext } from '../../../lib/featureFlagsContext';
import { CustomComboBoxDataTids } from '../../../internal/CustomComboBox';

// eslint-disable-next-line jest/no-mocks-import
const { getCities } = require('../__mocks__/getCities.js');

export default { title: 'ComboBox' } as Meta;

export const SimpleComboboxStory: Story = () => (
  <div style={{ paddingBottom: 230, paddingRight: 40 }}>
    <SimpleCombobox />
  </div>
);
SimpleComboboxStory.storyName = 'simple combobox';

SimpleComboboxStory.parameters = {
  creevey: {
    skip: {
      'story-skip-0': {
        in: ['ie11', 'ie118px', 'ie11Flat8px', 'ie11Dark', 'ie112022', 'ie112022Dark'],
        tests: ['hovered', 'selected_2', 'select_1'],
      },

      // TODO @Khlutkova fix after update browsers
      'story-skip-1': { in: ['chrome8px', 'chromeFlat8px', 'chrome', 'chromeDark'], tests: ['hovered'] },
    },
    tests: {
      async plain() {
        await this.expect(await this.takeScreenshot()).to.matchImage('plain');
      },
      async opened() {
        await this.browser
          .actions({
            bridge: true,
          })
          .click(this.browser.findElement({ css: '[data-comp-name~="InputLikeText"]' }))
          .perform();
        await this.expect(await this.takeScreenshot()).to.matchImage('opened');
      },
      async hovered() {
        await this.browser
          .actions({
            bridge: true,
          })
          .click(this.browser.findElement({ css: '[data-comp-name~="InputLikeText"]' }))
          .perform();
        await this.browser
          .actions({
            bridge: true,
          })
          .move({
            origin: this.browser.findElement({ css: '[data-comp-name~="MenuItem"]:nth-of-type(4)' }),
          })
          .perform();
        await this.expect(await this.takeScreenshot()).to.matchImage('hovered');
      },
      async selected() {
        await this.browser
          .actions({
            bridge: true,
          })
          .click(this.browser.findElement({ css: '[data-comp-name~="InputLikeText"]' }))
          .perform();
        await this.browser
          .actions({
            bridge: true,
          })
          .move({ origin: this.browser.findElement({ css: '[data-comp-name~="MenuItem"]:nth-of-type(4)' }) })
          .perform();
        await this.browser
          .actions({
            bridge: true,
          })
          .press()
          .release()
          .perform();
        await this.expect(await this.takeScreenshot()).to.matchImage('selected');
      },
      async 'search result'() {
        await this.browser
          .actions({
            bridge: true,
          })
          .click(this.browser.findElement({ css: '[data-comp-name~="InputLikeText"]' }))
          .perform();
        await this.browser
          .actions({
            bridge: true,
          })
          .sendKeys('Second')
          .pause(500)
          .perform();
        await this.expect(await this.takeScreenshot()).to.matchImage('search result');
      },
      async selcted() {
        await this.browser
          .actions({
            bridge: true,
          })
          .click(this.browser.findElement({ css: '[data-comp-name~="InputLikeText"]' }))
          .perform();
        await this.browser
          .actions({
            bridge: true,
          })
          .sendKeys('Second')
          .perform();
        await delay(1000);
        await this.browser
          .actions({
            bridge: true,
          })
          .sendKeys(this.keys.ENTER)
          .perform();
        await this.expect(await this.takeScreenshot()).to.matchImage('selcted');
      },
      async 'opened again'() {
        await this.browser
          .actions({
            bridge: true,
          })
          .click(this.browser.findElement({ css: '[data-comp-name~="InputLikeText"]' }))
          .perform();
        await this.browser
          .actions({
            bridge: true,
          })
          .sendKeys('Second')
          .perform();
        await delay(1000);
        await this.browser
          .actions({
            bridge: true,
          })
          .sendKeys(this.keys.ENTER)
          .perform();
        await this.browser
          .actions({
            bridge: true,
          })
          .click(this.browser.findElement({ css: '[data-comp-name~="Input"]' }))
          .perform();
        await this.expect(await this.takeScreenshot()).to.matchImage('opened again');
      },
      async 'search result_0'() {
        await this.browser
          .actions({
            bridge: true,
          })
          .click(this.browser.findElement({ css: '[data-comp-name~="InputLikeText"]' }))
          .perform();
        await this.browser
          .actions({
            bridge: true,
          })
          .sendKeys('Такого точно нету')
          .pause(500)
          .perform();
        await this.expect(await this.takeScreenshot()).to.matchImage('search result_0');
      },
      async select() {
        await this.browser
          .actions({
            bridge: true,
          })
          .click(this.browser.findElement({ css: '[data-comp-name~="InputLikeText"]' }))
          .perform();
        await this.browser
          .actions({
            bridge: true,
          })
          .sendKeys(this.keys.ARROW_DOWN)
          .sendKeys(this.keys.ARROW_DOWN)
          .sendKeys(this.keys.ARROW_DOWN)
          .perform();
        await this.expect(await this.takeScreenshot()).to.matchImage('select');
      },
      async submit() {
        await this.browser
          .actions({
            bridge: true,
          })
          .click(this.browser.findElement({ css: '[data-comp-name~="InputLikeText"]' }))
          .perform();

        await delay(1000);

        await this.browser
          .actions({
            bridge: true,
          })
          .sendKeys(this.keys.ARROW_DOWN)
          .sendKeys(this.keys.ARROW_DOWN)
          .sendKeys(this.keys.ARROW_DOWN)
          .sendKeys(this.keys.ENTER)
          .perform();
        await this.expect(await this.takeScreenshot()).to.matchImage('submit');
      },
      async select_1() {
        await delay(1000);
        await this.browser
          .actions({
            bridge: true,
          })
          .click(this.browser.findElement({ css: '[data-comp-name~="InputLikeText"]' }))
          .pause(1000)
          .sendKeys('Second')
          .pause(500)
          .perform();
        await this.browser
          .actions({
            bridge: true,
          })
          .move({ origin: this.browser.findElement({ css: 'body' }) })
          .perform();

        await delay(1000);

        await this.browser
          .actions({
            bridge: true,
          })
          .press()
          .release()
          .perform();
        await this.expect(await this.takeScreenshot()).to.matchImage('select_1');
      },
      async selected_2() {
        await delay(1000);

        await this.browser
          .actions({
            bridge: true,
          })
          .click(this.browser.findElement({ css: '[data-comp-name~="InputLikeText"]' }))
          .pause(1000)
          .sendKeys('Second')
          .pause(500)
          .perform();
        await this.browser
          .actions({
            bridge: true,
          })
          .click(this.browser.findElement({ css: 'body' }))
          .perform();

        await delay(1000);

        await this.browser
          .actions({
            bridge: true,
          })
          .click(this.browser.findElement({ css: '[data-comp-name~="InputLikeText"]' }))
          .perform();
        await this.expect(await this.takeScreenshot()).to.matchImage('selected_2');
      },
    },
  },
};

export const OpenToTop: Story = () => (
  <div data-tid="container" style={{ padding: '250px 40px 4px 4px', position: 'absolute', bottom: 0 }}>
    <SimpleCombobox />
  </div>
);
OpenToTop.storyName = 'open to top';

OpenToTop.parameters = {
  creevey: {
    skip: {
      'story-skip-0': { in: ['ie11', 'ie118px', 'ie11Flat8px', 'ie11Dark'], tests: 'hovered' },

      // TODO @Khlutkova fix after update browsers
      'story-skip-1': { in: ['chrome8px', 'chromeFlat8px', 'chrome', 'chromeDark'], tests: ['hovered'] },
    },
    tests: {
      async plain() {
        const element = await this.browser.findElement({ css: '[data-tid="container"]' });
        await this.expect(await element.takeScreenshot()).to.matchImage('plain');
      },
      async opened() {
        const element = await this.browser.findElement({ css: '[data-tid="container"]' });
        await this.browser
          .actions({
            bridge: true,
          })
          .click(this.browser.findElement({ css: '[data-comp-name~="InputLikeText"]' }))
          .perform();
        await this.expect(await element.takeScreenshot()).to.matchImage('opened');
      },
      async hovered() {
        const element = await this.browser.findElement({ css: '[data-tid="container"]' });
        await this.browser
          .actions({
            bridge: true,
          })
          .click(this.browser.findElement({ css: '[data-comp-name~="InputLikeText"]' }))
          .perform();
        await this.browser
          .actions({
            bridge: true,
          })
          .move({
            origin: this.browser.findElement({ css: '[data-comp-name~="MenuItem"]:nth-of-type(4)' }),
          })
          .perform();
        await this.expect(await element.takeScreenshot()).to.matchImage('hovered');
      },
      async selected() {
        const element = await this.browser.findElement({ css: '[data-tid="container"]' });
        await this.browser
          .actions({
            bridge: true,
          })
          .click(this.browser.findElement({ css: '[data-comp-name~="InputLikeText"]' }))
          .perform();
        await this.browser
          .actions({
            bridge: true,
          })
          .move({
            origin: this.browser.findElement({ css: '[data-comp-name~="MenuItem"]:nth-of-type(4)' }),
          })
          .perform();
        await this.browser
          .actions({
            bridge: true,
          })
          .press()
          .release()
          .perform();
        await this.expect(await element.takeScreenshot()).to.matchImage('selected');
      },
    },
  },
};

export const AlwaysReject: Story = () => (
  <div style={{ paddingBottom: 100, paddingRight: 80 }}>
    <ComboBox getItems={() => Promise.reject()} />
  </div>
);
AlwaysReject.storyName = 'always reject';

AlwaysReject.parameters = {
  creevey: {
    tests: {
      async opened() {
        await this.browser
          .actions({
            bridge: true,
          })
          .click(this.browser.findElement({ css: '[data-comp-name~="InputLikeText"]' }))
          .perform();
        await this.expect(await this.takeScreenshot()).to.matchImage('opened');
      },
    },
  },
};

interface SampleState {
  delay: number;
}
export const SimpleComboboxWithDelay = () => {
  class Sample extends React.Component {
    public state: SampleState = {
      delay: 1000,
    };
    public render() {
      return (
        <div>
          <SimpleCombobox noInitialValue delay={this.state.delay} />
          <p>
            <label>
              Delay:
              <input type="number" value={this.state.delay} onChange={this.handleChangeDelay} />
            </label>
          </p>
        </div>
      );
    }

    private handleChangeDelay = (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.valueAsNumber;

      this.setState({
        delay: value,
      });
    };
  }

  return <Sample />;
};
SimpleComboboxWithDelay.storyName = 'simple combobox with delay';
SimpleComboboxWithDelay.parameters = { creevey: { skip: true } };

export const WithErrorHandling = () => (
  <TestComboBox onSearch={search} renderItem={renderValue} onUnexpectedInput={errorStrategy} />
);
WithErrorHandling.storyName = 'with error handling';
WithErrorHandling.parameters = { creevey: { skip: true } };

export const WithErrorSkipping = () => (
  <TestComboBox onSearch={search} renderItem={renderValue} onUnexpectedInput={nullStrategy} />
);
WithErrorSkipping.storyName = 'with error skipping';
WithErrorSkipping.parameters = { creevey: { skip: true } };

export const WithWarning = () => (
  <TestComboBox onSearch={search} renderItem={renderValue} onUnexpectedInput={warningStrategy} />
);
WithWarning.storyName = 'with warning';
WithWarning.parameters = { creevey: { skip: true } };

export const WithRejections = () => <TestComboBox onSearch={searchWithRejections} renderItem={renderValue} />;
WithRejections.storyName = 'with rejections';
WithRejections.parameters = { creevey: { skip: true } };

export const Disabled = () => <TestComboBox autoFocus disabled onSearch={search} renderItem={renderValue} />;
Disabled.storyName = 'disabled';
Disabled.parameters = { creevey: { skip: true } };

export const WithCustomElements = () => (
  // @ts-expect-error: Undocumented feature.
  <TestComboBox onSearch={searchWithCustomElements} renderItem={renderValue} onUnexpectedInput={errorStrategy} />
);
WithCustomElements.storyName = 'with custom elements';
WithCustomElements.parameters = { creevey: { skip: true } };

export const Autocomplete = () => (
  <TestComboBox
    drawArrow={false}
    searchOnFocus={false}
    onSearch={search}
    renderItem={renderValue}
    totalCount={12}
    onUnexpectedInput={errorStrategy}
  />
);
Autocomplete.storyName = 'autocomplete';
Autocomplete.parameters = { creevey: { skip: true } };

export const WithAutoFocus = () => (
  <div style={{ paddingBottom: 330, paddingRight: 40 }}>
    <TestComboBox
      autoFocus
      onSearch={search}
      renderItem={renderValue}
      totalCount={12}
      onUnexpectedInput={errorStrategy}
    />
  </div>
);
WithAutoFocus.storyName = 'with autoFocus';

export const WithAutoFocusAndAutocomplete = () => (
  <TestComboBox
    autoFocus
    drawArrow={false}
    searchOnFocus={false}
    onSearch={search}
    renderItem={renderValue}
    totalCount={12}
    onUnexpectedInput={errorStrategy}
  />
);
WithAutoFocusAndAutocomplete.storyName = 'with autoFocus and autocomplete';
WithAutoFocusAndAutocomplete.parameters = { creevey: { skip: true } };

export const WithMaxMenuHeight = () => <TestComboBox onSearch={search} renderItem={renderValue} maxMenuHeight={200} />;
WithMaxMenuHeight.storyName = 'with maxMenuHeight';
WithMaxMenuHeight.parameters = { creevey: { skip: true } };

export const WithBorderless = () => (
  <TestComboBox onSearch={search} renderItem={renderValue} onUnexpectedInput={nullStrategy} borderless />
);
WithBorderless.storyName = 'with borderless';
WithBorderless.parameters = { creevey: { skip: true } };

export const WithCenterAlign = () => <SimpleCombobox align={'center'} placeholder={'placeholder'} noInitialValue />;
WithCenterAlign.storyName = 'with center align';
WithCenterAlign.parameters = { creevey: { skip: true } };

export const NotRenderNotFound = () => (
  <SimpleCombobox placeholder={'placeholder'} noInitialValue renderNotFound={() => null} />
);
NotRenderNotFound.storyName = 'not render NotFound';
NotRenderNotFound.parameters = { creevey: { skip: true } };

export const WithRightAlign = () => <SimpleCombobox align={'right'} placeholder={'placeholder'} noInitialValue />;
WithRightAlign.storyName = 'with right align';
WithRightAlign.parameters = { creevey: { skip: true } };

export const WithMaxLength = () => <SimpleCombobox maxLength={10} placeholder={'placeholder'} noInitialValue />;
WithMaxLength.storyName = 'with maxLength';
WithMaxLength.parameters = { creevey: { skip: true } };

export const ToogleError: Story = () => <ComboBoxWithErrorToggler />;
ToogleError.storyName = 'toogle error';

ToogleError.parameters = {
  creevey: {
    skip: {
      flaky: { in: ['chrome2022', 'chrome2022Dark'], tests: ['plain again', 'with error'] },
    },
    tests: {
      async plain() {
        await this.expect(await this.takeScreenshot()).to.matchImage('plain');
      },
      async 'with error'() {
        await this.browser
          .actions({
            bridge: true,
          })
          .click(this.browser.findElement({ css: "[data-comp-name~='Toggle']" }))
          .pause(200)
          .perform();
        await this.expect(await this.takeScreenshot()).to.matchImage('with error');
      },
      async 'plain again'() {
        await this.browser
          .actions({
            bridge: true,
          })
          .click(this.browser.findElement({ css: "[data-comp-name~='Toggle']" }))
          .pause(200)
          .perform();
        await this.browser
          .actions({
            bridge: true,
          })
          .click(this.browser.findElement({ css: "[data-comp-name~='Toggle']" }))
          .pause(200)
          .perform();
        await this.expect(await this.takeScreenshot()).to.matchImage('plain again');
      },
    },
  },
};

export const WithNullOnUnexpectedInput = () => (
  <ComboBox getItems={() => Promise.resolve([])} onUnexpectedInput={() => null} />
);
WithNullOnUnexpectedInput.storyName = 'with `null` onUnexpectedInput';
WithNullOnUnexpectedInput.parameters = { creevey: { skip: true } };

export const WithExternalValue: Story = () => <ComboBoxWithExternalValue />;
WithExternalValue.storyName = 'with external value';

WithExternalValue.parameters = {
  creevey: {
    tests: {
      async 'initial value'() {
        await this.expect(await this.takeScreenshot()).to.matchImage('initial value');
      },
      async 'reset value'() {
        await this.browser
          .actions({
            bridge: true,
          })
          .click(this.browser.findElement({ css: '[data-tid="resetBtn"]' }))
          .perform();
        await this.expect(await this.takeScreenshot()).to.matchImage('reset value');
      },
      async 'set value'() {
        await this.browser
          .actions({
            bridge: true,
          })
          .click(this.browser.findElement({ css: '[data-tid="resetBtn"]' }))
          .click(this.browser.findElement({ css: '[data-tid="setValueBtn"]' }))
          .perform();
        await this.expect(await this.takeScreenshot()).to.matchImage('set value');
      },
    },
  },
};

export const WithRenderItemState = () => <SimpleCombobox renderItem={(_, state) => String(state)} />;
WithRenderItemState.storyName = 'with renderItem state';
WithRenderItemState.parameters = { creevey: { skip: true } };

export const OpenCloseSearchMethods = () => {
  let combobox: Nullable<ComboBox<ValueType>> = null;
  return (
    <div>
      <ComboBox
        ref={(e) => (combobox = e)}
        value={items[0]}
        getItems={search}
        renderItem={(i) => i.name}
        valueToString={(v) => v.name}
        renderValue={(v) => v.name}
        itemToValue={(v) => v.name}
      />{' '}
      <span className="control-buttons">
        <button onClick={() => combobox && combobox.open()}>open</button>{' '}
        <button onClick={() => combobox && combobox.search('')}>empty search</button>{' '}
        <button onClick={() => combobox && combobox.search()}>search current value</button>{' '}
        <button onClick={() => combobox && combobox.search('two')}>search &quot;two&quot;</button>{' '}
        <button onClick={() => combobox && combobox.close()}>close</button>
      </span>
    </div>
  );
};
OpenCloseSearchMethods.storyName = 'open, close, search methods';
OpenCloseSearchMethods.parameters = { creevey: { skip: true } };

export const FocusFlow: Story = () => (
  <div>
    <SimpleCombobox autoFocus />
    <br />
    <br />
    <SimpleCombobox />
  </div>
);
FocusFlow.storyName = 'focus flow';

FocusFlow.parameters = {
  creevey: {
    tests: {
      async before() {
        await this.expect(await this.takeScreenshot()).to.matchImage('before');
      },
      async 'after Enter on Item'() {
        await this.browser
          .actions({
            bridge: true,
          })
          .sendKeys(this.keys.ENTER)
          .perform();
        await this.expect(await this.takeScreenshot()).to.matchImage('after Enter on Item');
      },
      async 'after tab to the next field'() {
        await this.browser
          .actions({
            bridge: true,
          })
          .sendKeys(this.keys.ENTER)
          .perform();
        await this.browser
          .actions({
            bridge: true,
          })
          .sendKeys(this.keys.TAB)
          .perform();
        await this.expect(await this.takeScreenshot()).to.matchImage('after tab to the next field');
      },
    },
  },
};

export const NestedComboBoxes = () => {
  const RecursiveComboboxes = ({ depth }: { depth: number }) => (
    <div>
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={`${depth}-${i}`}>{depth > 1 ? <RecursiveComboboxes depth={depth - 1} /> : <SimpleCombobox />}</div>
      ))}
    </div>
  );
  return <RecursiveComboboxes depth={10} />;
};
NestedComboBoxes.storyName = '1024 nested ComboBoxes';
NestedComboBoxes.parameters = { creevey: { skip: true } };

export const WithManyComplexMenuItems = () => (
  <div>
    <ComplexCombobox />
  </div>
);
WithManyComplexMenuItems.storyName = 'with many complex menu items';
WithManyComplexMenuItems.parameters = { creevey: { skip: true } };

export const WithAddButton = () => (
  <TestComboBox
    onSearch={search}
    renderItem={renderValue}
    renderAddButton={(query) => query && <MenuItem onClick={() => alert(query)}>Добавить {query}</MenuItem>}
  />
);
WithAddButton.storyName = 'with add button';
WithAddButton.parameters = { creevey: { skip: true } };

interface ComboBoxWithErrorTogglerState {
  value: { label: number };
  error: boolean;
}
class ComboBoxWithErrorToggler extends React.Component {
  public state: ComboBoxWithErrorTogglerState = {
    error: false,
    value: { label: 0 },
  };

  public render() {
    return (
      <>
        <ComboBox error={this.state.error} value={this.state.value} getItems={() => Promise.resolve([{ label: 0 }])} />
        <Toggle
          onValueChange={(value) =>
            this.setState((state: ComboBoxWithErrorTogglerState) => ({
              error: value,
              value: { label: state.value.label + 1 },
            }))
          }
        />
      </>
    );
  }
}

interface ValueType {
  id: number;
  name: string;
}

interface ComboBoxState {
  value: Nullable<ValueType>;
  error: boolean;
  warning: boolean;
}

interface TestComboboxProps<T> extends Omit<ComboBoxProps<T>, 'onUnexpectedInput' | 'getItems'> {
  onSearch: (query: string) => Promise<T[]>;
  onUnexpectedInput?: (updateState: (newState: Pick<ComboBoxState, never>) => void) => (x: string) => any;
}

class TestComboBox extends React.Component<TestComboboxProps<ValueType>, ComboBoxState> {
  public static defaultProps = {
    ...ComboBox.defaultProps,
    onSearch: () => Promise.resolve([]),
  };
  public state: ComboBoxState = {
    value: null,
    error: false,
    warning: false,
  };

  private combobox: Nullable<ComboBox<ValueType>> = null;

  public render() {
    return (
      <div>
        <ComboBox
          align={this.props.align}
          drawArrow={this.props.drawArrow}
          searchOnFocus={this.props.searchOnFocus}
          autoFocus={this.props.autoFocus}
          borderless={this.props.borderless}
          itemToValue={(x) => x.id}
          disabled={this.props.disabled}
          error={this.state.error}
          warning={this.state.warning}
          value={this.state.value}
          maxMenuHeight={this.props.maxMenuHeight}
          onBlur={action('blur')}
          onFocus={() => this.setState({ error: false, warning: false }, action('focus'))}
          getItems={this.props.onSearch}
          renderItem={this.props.renderItem}
          renderValue={renderValue}
          renderAddButton={this.props.renderAddButton}
          valueToString={(x) => x.name}
          placeholder="numbers"
          onValueChange={this.handleChange}
          onUnexpectedInput={this.props.onUnexpectedInput ? this.props.onUnexpectedInput(this.updateState) : undefined}
          totalCount={this.props.totalCount}
          renderTotalCount={(found, total) => `Найдено ${found} из ${total}`}
          ref={(el) => {
            this.combobox = el;
          }}
        />{' '}
        <button
          onClick={() => {
            if (this.combobox) {
              this.combobox.focus();
            }
          }}
        >
          Focus
        </button>
        {this.state.error && <div style={{ color: 'red' }}>Необходимо выбрать значение</div>}
        {this.state.warning && <div style={{ color: '#f50' }}>Вы не выбрали значение</div>}
      </div>
    );
  }

  private updateState = (newState: Partial<ComboBoxState>) => this.setState((state) => ({ ...state, ...newState }));

  private handleChange = (value: ValueType) => {
    this.setState({ value, error: false });
  };
}

interface SimpleComboboxProps {
  noInitialValue?: boolean;
  delay?: number;
}

interface SimpleComboboxState {
  value: Nullable<{ value: number; label: string }>;
}

interface ComboboxItem {
  value: number;
  label: string;
}

@rootNode
class SimpleCombobox extends React.Component<SimpleComboboxProps & ComboBoxProps<any>, SimpleComboboxState> {
  public static defaultProps = {
    ...ComboBox.defaultProps,
    getItems: () => Promise.resolve([]),
  };
  public state = {
    value: this.props.noInitialValue ? null : { value: 1, label: 'First' },
  };
  private setRootNode!: TSetRootNode;
  private comboBoxRef: React.RefObject<ComboBox> = React.createRef<ComboBox>();

  public render() {
    return (
      <ComboBox
        {...this.props}
        ref={mergeRefs([this.setRootNode, this.comboBoxRef])}
        value={this.state.value}
        getItems={this.getItems}
        onValueChange={(value) => this.setState({ value })}
        totalCount={this.props.renderTotalCount ? this.items.length + 1 : undefined}
        renderTotalCount={this.props.renderTotalCount}
      />
    );
  }

  public open() {
    if (this.comboBoxRef.current) {
      this.comboBoxRef.current.open();
    }
  }

  public search(query?: string) {
    if (this.comboBoxRef.current) {
      this.comboBoxRef.current.search(query);
    }
  }

  private items: ComboboxItem[] = [
    { value: 1, label: 'First' },
    { value: 2, label: 'Second' },
    { value: 3, label: 'Third' },
    { value: 4, label: 'Fourth' },
    { value: 5, label: 'Fifth' },
    { value: 6, label: 'Sixth' },
    { value: 7, label: 'A long long long long long long time ago' },
  ];
  private getItems = (query: string) =>
    Promise.resolve(
      this.items.filter((x) => x.label.toLowerCase().includes(query.toLowerCase()) || x.value.toString(10) === query),
    ).then<ComboboxItem[]>((result) => new Promise((ok) => setTimeout(ok, this.props.delay || 0, result)));
}

interface ComplexComboboxItem {
  value: number;
  label: string;
}
interface City {
  Id: number;
  City: string;
}
interface ComboboxSearchResult {
  foundItems: City[];
  totalCount: number;
}
type ComplexComboboxProps = Omit<ComboBoxProps<unknown>, 'getItems'>;
interface ComplexComboboxState {
  value: Nullable<ComplexComboboxItem>;
}
class ComplexCombobox extends React.Component<ComplexComboboxProps> {
  public static defaultProps = ComboBox.defaultProps;
  public state: ComplexComboboxState = {
    value: null,
  };
  private popularItems: ComplexComboboxItem[] = [
    { value: 956, label: 'Махачкала' },
    { value: 4974, label: 'Верхняя-Пышма' },
    { value: 4980, label: 'Екатеринбург' },
  ];

  public render() {
    return (
      <ComboBox
        onValueChange={this.handleChange}
        value={this.state.value}
        getItems={this.getItems}
        renderItem={this.renderItem}
        placeholder="Начните вводить название"
      />
    );
  }

  private handleChange = (value: ComplexComboboxItem) => this.setState({ value });

  private getItems = (query: string) => {
    return getCities(query)
      .then(({ foundItems, totalCount }: ComboboxSearchResult) => ({
        foundItems: foundItems.map(this.mapCity),
        totalCount,
      }))
      .then(({ foundItems, totalCount }: { foundItems: ComplexComboboxItem[]; totalCount: number }) => ({
        popularItems: query.length === 0 ? this.popularItems : [],
        itemsToShow: foundItems,
        totalCount,
      }))
      .then(
        ({
          popularItems,
          itemsToShow,
          totalCount,
        }: {
          popularItems: ComplexComboboxItem[];
          itemsToShow: ComplexComboboxItem[];
          totalCount: number;
        }) =>
          ([] as unknown[]).concat(
            popularItems,
            popularItems.length ? ((<MenuSeparator />) as any) : [],
            itemsToShow,
            this.renderTotalCount(itemsToShow.length, totalCount),
          ),
      );
  };

  private renderItem = (item: ComplexComboboxItem) => {
    return item ? (
      <Gapped>
        <div style={{ width: 40 }}>{item.value}</div>
        <div style={{ width: 210, whiteSpace: 'normal' }}>{item.label}</div>
      </Gapped>
    ) : null;
  };

  private mapCity = ({ Id, City }: { Id: number; City: string }) => ({
    value: Id,
    label: City,
  });

  private renderTotalCount = (foundCount: number, totalCount: number) => {
    if (foundCount < totalCount) {
      return (
        <MenuHeader size={this.props.size}>
          Показано {foundCount} из {totalCount} найденных городов.
        </MenuHeader>
      );
    }

    return [];
  };
}

function errorStrategy(setState: (state: Partial<ComboBoxState>) => void): (x: any) => void {
  return (x) => {
    if (x) {
      setState({ error: true });
    }
  };
}

function nullStrategy(setState: (state: Partial<ComboBoxState>) => void): (x: any) => void {
  return (x) => {
    if (x) {
      setState({ value: null });
    }
  };
}

function warningStrategy(setState: (state: Partial<ComboBoxState>) => void): (x: any) => void {
  return (x) => {
    if (x) {
      setState({ warning: true });
    }
  };
}

const items: ValueType[] = [
  { id: 1, name: 'one' },
  { id: 2, name: 'two' },
  { id: 3, name: 'three' },
  { id: 4, name: 'four' },
  { id: 5, name: 'five' },
  { id: 6, name: 'six' },
  { id: 7, name: 'seven' },
  { id: 8, name: 'eight' },
  { id: 9, name: 'nine' },
  { id: 10, name: 'ten' },
  { id: 11, name: 'eleven' },
  { id: 12, name: 'twelve' },
  { id: 13, name: 'very long long long long long long name' },
  { id: 99, name: 'Putinka' },
];

function search(query: string) {
  return Promise.resolve(items.filter((x) => x.name.toLowerCase().indexOf(query.toLowerCase()) !== -1));
}

let searchCount = 0;
function searchWithRejections(query: string): Promise<ValueType[]> {
  const random = (v: number) => Math.random() * v;

  const delay = (v: any) => new Promise((resolve) => setTimeout(resolve, random(5) * 100, v));

  searchCount++;
  return Promise.resolve()
    .then(delay)
    .then(() => {
      if (searchCount % 2) {
        throw new Error();
      }
      return items.filter((x) => x.name.indexOf(query.toLowerCase()) !== -1);
    });
}

function searchWithCustomElements(query: string) {
  const _items = items.filter((x) => x.name.includes(query.toLowerCase()));
  const disabled = <MenuItem disabled>Nothing was found</MenuItem>;
  return Promise.resolve([
    <MenuItem key={1} comment="Hello" icon={<BabyIcon />} disabled>
      World
    </MenuItem>,
    <MenuSeparator key={2} />,
    ..._items.slice(0, 3),
    ...(_items.slice(0, 3).length ? [<MenuSeparator key={5} />] : []),
    ...(_items.slice(3).length ? _items.slice(3) : [disabled]),
    <MenuSeparator key={3} />,
    <MenuItem key={4} link onClick={() => alert('Clicked')}>
      Ha ha
    </MenuItem>,
  ]);
}

function renderValue({ id, name }: ValueType): React.ReactNode {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        maxWidth: 250,
      }}
    >
      <span
        style={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          marginRight: 20,
        }}
      >
        {name}
      </span>
      <span>{id}</span>
    </div>
  );
}

interface ComboBoxWithExternalValueItem {
  value: string;
  label: string;
}
interface ComboBoxWithExternalValueState {
  value: ComboBoxWithExternalValueItem;
  warning: boolean;
}
class ComboBoxWithExternalValue extends React.Component {
  public state: ComboBoxWithExternalValueState = {
    value: { value: '1', label: 'First' },
    warning: false,
  };

  private combobox: Nullable<ComboBox<any>>;

  public render = () => (
    <div style={{ paddingBottom: 60 }}>
      <ComboBox
        getItems={this.getItems}
        value={this.state.value}
        onValueChange={this.onChange}
        onUnexpectedInput={this.onUnexpectedInput}
        warning={this.state.warning}
        ref={(element) => (this.combobox = element)}
      />
      <Button data-tid="setValueBtn" onClick={this.fill}>
        Set `First`
      </Button>
      <Button data-tid="resetBtn" onClick={this.reset}>
        Reset
      </Button>
      <div>
        this.state.value: <code>{JSON.stringify(this.state.value)}</code>
      </div>
    </div>
  );

  private fill = () => {
    this.setState({
      value: { value: '1', label: 'First' },
      warning: false,
    });
  };

  private reset = () => {
    this.setState({
      warning: false,
      value: null,
    });
    if (this.combobox) {
      this.combobox.reset();
    }
  };

  private getItems = (q: string) =>
    Promise.resolve(
      [
        { value: '1', label: 'First' },
        { value: '2', label: 'Second' },
      ].filter((x) => x.label.toLowerCase().includes(q.toLowerCase()) || x.value === q),
    );

  private onChange = (value: { value: string; label: string }) => this.setState({ value, warning: false });

  private onUnexpectedInput = () => {
    this.setState({
      warning: true,
    });
    return null;
  };
}

export const WithLeftIcon = () => (
  <Gapped vertical>
    <SimpleCombobox leftIcon={<SearchIcon />} searchOnFocus={false} autoFocus />
    <SimpleCombobox leftIcon={<SearchIcon />} size="small" drawArrow={false} />
    <SimpleCombobox leftIcon={<SearchIcon />} size="medium" drawArrow={false} />
    <SimpleCombobox leftIcon={<SearchIcon />} size="large" drawArrow={false} />
  </Gapped>
);
WithLeftIcon.storyName = 'with left icon';

export const WithRightIcon = () => (
  <Gapped vertical>
    <SimpleCombobox rightIcon={<SearchIcon />} searchOnFocus={false} autoFocus />
    <SimpleCombobox rightIcon={<SearchIcon />} size="small" />
    <SimpleCombobox rightIcon={<SearchIcon />} size="medium" />
    <SimpleCombobox rightIcon={<SearchIcon />} size="large" />
  </Gapped>
);
WithRightIcon.storyName = 'with right icon';

export const WithTooltip: Story = () => {
  return (
    <div style={{ marginTop: 20 }}>
      <Tooltip render={() => 'tooltip on focus'} trigger="focus" pos="right top">
        <SimpleCombobox />
      </Tooltip>
    </div>
  );
};

WithTooltip.storyName = 'with tooltip';

WithTooltip.parameters = {
  creevey: {
    tests: {
      async 'show and hide Tooltip'() {
        const body = await this.browser.findElement({ css: 'body' });

        await this.browser
          .actions({ bridge: true })
          .click(this.browser.findElement({ css: '[data-tid="InputLikeText__input"]' }))
          .pause(1000)
          .perform();

        const showTooltip = await body.takeScreenshot();

        await this.browser.actions({ bridge: true }).click(body).pause(1000).perform();

        const hideTooltip = await body.takeScreenshot();

        await this.expect({ showTooltip, hideTooltip }).to.matchImages();
      },
    },
  },
};

export const MobileSimple: Story = () => (
  <>
    <SimpleCombobox />
    <div style={{ height: 15 }} />
    <ComplexCombobox />
    <div style={{ height: 15 }} />
    <TestComboBox
      onSearch={search}
      renderItem={renderValue}
      renderAddButton={(query) =>
        query && (
          <MenuItem key={'mobileAddButton'} isMobile onClick={() => alert(query)}>
            Добавить {query}
          </MenuItem>
        )
      }
    />
  </>
);
MobileSimple.storyName = 'mobile simple';
MobileSimple.parameters = {
  viewport: {
    defaultViewport: 'iphone',
  },
  creevey: {
    tests: {
      async opened() {
        await this.browser
          .actions({ bridge: true })
          .click(this.browser.findElement({ css: `[data-tid~="${CustomComboBoxDataTids.comboBoxView}"]` }))
          .perform();
        await delay(1000);

        await this.expect(await this.browser.takeScreenshot()).to.matchImage('opened');
      },
    },
  },
};

export const WithManualPosition: Story = () => {
  const [menuPos, setMenuPos] = React.useState<'top' | 'bottom'>('top');
  const [isPortalDisabled, setIsPortalDisabled] = React.useState(false);

  return (
    <div style={{ marginTop: '300px', paddingBottom: '300px' }}>
      <SimpleCombobox disablePortal={isPortalDisabled} menuPos={menuPos} />
      <button data-tid="pos" onClick={() => setMenuPos(menuPos === 'top' ? 'bottom' : 'top')}>
        change pos to {menuPos === 'top' ? 'bottom' : 'top'}
      </button>
      <button data-tid="portal" onClick={() => setIsPortalDisabled(!isPortalDisabled)}>
        {isPortalDisabled ? 'enable' : 'disable'} portal
      </button>
    </div>
  );
};
WithManualPosition.storyName = 'with manual position';
WithManualPosition.parameters = {
  creevey: {
    skip: { 'no themes': { in: /^(?!\b(chrome|firefox)\b)/ } },
    tests: {
      async 'opened top with portal'() {
        await this.browser
          .actions({
            bridge: true,
          })
          .click(this.browser.findElement({ css: '[data-comp-name~="InputLikeText"]' }))
          .perform();
        await delay(1000);

        await this.expect(await this.takeScreenshot()).to.matchImage('opened top with portal');
      },
      async 'opened bottom with portal'() {
        await this.browser
          .actions({
            bridge: true,
          })
          .click(this.browser.findElement({ css: '[data-tid~="pos"]' }))
          .pause(1000)
          .click(this.browser.findElement({ css: '[data-comp-name~="InputLikeText"]' }))
          .perform();
        await delay(1000);

        await this.expect(await this.takeScreenshot()).to.matchImage('opened bottom with portal');
      },
      async 'opened top without portal'() {
        await this.browser
          .actions({
            bridge: true,
          })
          .click(this.browser.findElement({ css: '[data-tid~="portal"]' }))
          .pause(1000)
          .click(this.browser.findElement({ css: '[data-comp-name~="InputLikeText"]' }))
          .perform();
        await delay(1000);

        await this.expect(await this.takeScreenshot()).to.matchImage('opened top without portal');
      },
      async 'opened bottom without portal'() {
        await this.browser
          .actions({
            bridge: true,
          })
          .click(this.browser.findElement({ css: '[data-tid~="portal"]' }))
          .pause(1000)
          .click(this.browser.findElement({ css: '[data-tid~="pos"]' }))
          .pause(1000)
          .click(this.browser.findElement({ css: '[data-comp-name~="InputLikeText"]' }))
          .perform();
        await delay(1000);

        await this.expect(await this.takeScreenshot()).to.matchImage('opened bottom without portal');
      },
    },
  },
};

export const WithExtendedItem: Story = () => {
  const [value, setValue] = React.useState<ValueType>();

  const CustomItem = ({ id, name }: ValueType) => (
    <span>
      CustomItem: {id} + {name}
    </span>
  );

  const RenderItem = ({ id, name, state = null }: ValueType & { state?: MenuItemState }) => (
    <span>
      RenderItem: {id} + {name} (state: {state})
    </span>
  );

  const ItemWrapper = ({ id, name }: ValueType) => (
    <span>
      ItemWrapper: {id} + {name}
    </span>
  );

  return (
    <>
      Пример передачи в getItems всех допустимых типов.
      <br />
      Должны работать навигация клавишами и выбор пункта.
      <br />
      <ComboBox<ValueType>
        value={value}
        onValueChange={setValue}
        itemToValue={(item) => item.id}
        renderValue={(item) => item.name}
        valueToString={(item) => item.name}
        getItems={() =>
          Promise.resolve([
            { id: 1, name: 'Paris' },
            { id: 2, name: 'Madrid' },
            <MenuSeparator key={2} />,
            <hr key={3} />,
            <MenuItem key={1} {...{ id: 3, name: 'London' }}>
              <CustomItem id={3} name="London" />
            </MenuItem>,
            () => (
              <MenuItem {...{ id: 4, name: 'Berlin' }}>
                <CustomItem id={4} name="Berlin" />
              </MenuItem>
            ),
            { id: 5, name: 'Rome' },
            { id: 6, name: 'Amsterdam' },
          ])
        }
        renderItem={(item, state) => <RenderItem {...{ ...item, state }} />}
        itemWrapper={(item) =>
          function itemWrapper(props) {
            const isJust2Items = item.id === 5 || item.id === 6;
            return <button {...props}>{isJust2Items ? props.children : <ItemWrapper {...item} />}</button>;
          }
        }
      />
    </>
  );
};
WithExtendedItem.parameters = { creevey: { skip: true } };

export const Size: Story = () => {
  let small: SimpleCombobox | null = null;
  let medium: SimpleCombobox | null = null;
  let large: SimpleCombobox | null = null;
  const handleClick = () => {
    if (small) {
      small.search('');
      small.open();
    }
    if (medium) {
      medium.search('');
      medium.open();
    }
    if (large) {
      large.search('');
      large.open();
    }
  };
  return (
    <div style={{ height: 400, width: 1000 }}>
      <Button onClick={handleClick} data-tid="open-all">
        Open All
      </Button>
      <Gapped gap={60} style={{ paddingBottom: 230, paddingRight: 40 }}>
        <SimpleCombobox
          size={'small'}
          ref={(element) => {
            small = element;
          }}
          renderTotalCount={(foundCount: number, totalCount: number) =>
            `Показано ${foundCount} из ${totalCount} найденных элементов.`
          }
        />
        <SimpleCombobox
          size={'medium'}
          ref={(element) => {
            medium = element;
          }}
          renderTotalCount={(foundCount: number, totalCount: number) =>
            `Показано ${foundCount} из ${totalCount} найденных элементов.`
          }
        />
        <SimpleCombobox
          size={'large'}
          ref={(element) => {
            large = element;
          }}
          renderTotalCount={(foundCount: number, totalCount: number) =>
            `Показано ${foundCount} из ${totalCount} найденных элементов.`
          }
        />
      </Gapped>
    </div>
  );
};

Size.storyName = 'size';
Size.parameters = {
  creevey: {
    tests: {
      async 'clicked all'() {
        await this.browser
          .actions({
            bridge: true,
          })
          .click(this.browser.findElement({ css: '[data-tid="open-all"]' }))
          .pause(500)
          .perform();
        await this.browser.executeScript(function () {
          const containers = document.querySelectorAll('[data-tid~="ScrollContainer__inner"]');
          for (let i = 0; i < containers.length; i++) {
            containers[i].scrollTop += 300;
          }
        });
        await delay(1000);
        await this.expect(await this.takeScreenshot()).to.matchImage('ClickedAll');
      },
    },
  },
};

export const WithFeatureFlagsValueChange: Story = () => {
  const [value, setValue] = React.useState({ value: '', label: '' });

  const handleValueChange = () => {
    setValue({ value: `Обновленное значение`, label: `Обновленное значение` });
  };

  return (
    <div>
      <ReactUIFeatureFlagsContext.Provider value={{ comboBoxAllowValueChangeInEditingState: true }}>
        <Button onClick={handleValueChange}>Обновить</Button>
        <ComboBox
          value={value}
          searchOnFocus={false}
          getItems={() => Promise.resolve([])}
          onValueChange={(value) => setValue(value)}
          onInputValueChange={(value) => {
            setValue({ value, label: value });
          }}
        />
      </ReactUIFeatureFlagsContext.Provider>
    </div>
  );
};

WithFeatureFlagsValueChange.storyName = 'with featureFlags value change';
WithFeatureFlagsValueChange.parameters = {
  creevey: {
    tests: {
      async 'Update value'() {
        await this.browser
          .actions({
            bridge: true,
          })
          .click(this.browser.findElement({ css: `[data-tid~="${CustomComboBoxDataTids.comboBoxView}"]` }))
          .sendKeys('Тест...')
          .pause(500)
          .perform();
        const withTypedText = await this.browser.takeScreenshot();

        await this.browser
          .actions({
            bridge: true,
          })
          .click(this.browser.findElement({ css: `[data-tid~="${ButtonDataTids.root}"]` }))
          .pause(500)
          .perform();
        const updatedValue = await this.browser.takeScreenshot();
        await this.expect({ withTypedText, updatedValue }).to.matchImages();
      },
    },
  },
};
