import { generateUtilityClass, generateUtilityClasses } from '../className';

export interface RadioClasses {
  /** Class name applied to the root element. */
  root: string;
  /** Class name applied to the radio element. */
  radio: string;
  /** Class name applied to the icon element. */
  icon: string;
  /** Class name applied to the action element. */
  action: string;
  /** Class name applied to the input element. */
  input: string;
  /** Class name applied to the label element. */
  label: string;
  /** State class applied to the root, action slots if `checked`. */
  checked: string;
  /** State class applied to the root, action slots if `disabled`. */
  disabled: string;
  /** Class applied to the root element if the switch has visible focus */
  focusVisible: string;
  /** Class name applied to the root element if `color="primary"`. */
  colorPrimary: string;
  /** Class name applied to the root element if `color="danger"`. */
  colorDanger: string;
  /** Class name applied to the root element if `color="info"`. */
  colorInfo: string;
  /** Class name applied to the root element if `color="neutral"`. */
  colorNeutral: string;
  /** Class name applied to the root element if `color="success"`. */
  colorSuccess: string;
  /** Class name applied to the root element if `color="warning"`. */
  colorWarning: string;
  /** Styles applied to the root element when color inversion is triggered. */
  colorContext: string;
  /** Class name applied to the root element if `size="sm"`. */
  sizeSm: string;
  /** Class name applied to the root element if `size="md"`. */
  sizeMd: string;
  /** Class name applied to the root element if `size="lg"`. */
  sizeLg: string;
  /** Class name applied to the root element if `variant="outlined"`. */
  variantOutlined: string;
  /** Class name applied to the root element if `variant="soft"`. */
  variantSoft: string;
  /** Class name applied to the root element if `variant="solid"`. */
  variantSolid: string;
}

export type RadioClassKey = keyof RadioClasses;

export function getRadioUtilityClass(slot: string): string {
  return generateUtilityClass('JoyRadio', slot);
}

const radioClasses: RadioClasses = generateUtilityClasses('JoyRadio', [
  'root',
  'radio',
  'icon',
  'action',
  'input',
  'label',
  'checked',
  'disabled',
  'focusVisible',
  'colorPrimary',
  'colorDanger',
  'colorInfo',
  'colorNeutral',
  'colorSuccess',
  'colorWarning',
  'colorContext',
  'sizeSm',
  'sizeMd',
  'sizeLg',
  'variantOutlined',
  'variantSoft',
  'variantSolid',
]);

export default radioClasses;
