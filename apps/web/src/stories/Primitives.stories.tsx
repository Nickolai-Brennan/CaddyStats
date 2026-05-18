import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@/components/ui";

// ---------------------------------------------------------------------------
// Button
// ---------------------------------------------------------------------------
const ButtonMeta: Meta<typeof Button> = {
  title: "Primitives/Button",
  component: Button,
  tags: ["autodocs"],
  args: { children: "Click me" },
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "ghost"],
    },
    disabled: { control: "boolean" },
  },
};
export default ButtonMeta;
type ButtonStory = StoryObj<typeof Button>;

export const Primary: ButtonStory = { args: { variant: "primary" } };
export const Secondary: ButtonStory = { args: { variant: "secondary" } };
export const Ghost: ButtonStory = { args: { variant: "ghost" } };
export const Disabled: ButtonStory = { args: { disabled: true } };
