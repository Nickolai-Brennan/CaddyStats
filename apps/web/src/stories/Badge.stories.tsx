import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "@/components/ui";

const meta: Meta<typeof Badge> = {
  title: "Primitives/Badge",
  component: Badge,
  tags: ["autodocs"],
  args: { children: "Label" },
  argTypes: {
    tone: {
      control: "select",
      options: ["default", "success", "warning", "danger", "info"],
    },
  },
};
export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = { args: { tone: "default" } };
export const Success: Story = { args: { tone: "success", children: "Made Cut" } };
export const Warning: Story = { args: { tone: "warning", children: "T5 Risk" } };
export const DefaultDanger: Story = { args: { tone: "default", children: "WD" } };
export const DefaultInfo: Story = { args: { tone: "default", children: "FIR 72%" } };
