import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Modal, Drawer } from "@/components/ui";
import { Button } from "@/components/ui";

// ---------------------------------------------------------------------------
// Modal
// ---------------------------------------------------------------------------
const ModalMeta: Meta<typeof Modal> = {
  title: "Overlays/Modal",
  component: Modal,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};
export default ModalMeta;

function ModalDefaultDemo() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex h-screen items-center justify-center bg-slate-950 p-8">
      <Button onClick={() => setOpen(true)}>Open Modal</Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Projection Details">
        <p className="text-slate-300">
          Modal content goes here. Stats, projections, or confirmations.
        </p>
      </Modal>
    </div>
  );
}

export const Default: StoryObj<typeof Modal> = {
  render: () => <ModalDefaultDemo />,
};

function ModalLargeDemo() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex h-screen items-center justify-center bg-slate-950 p-8">
      <Button onClick={() => setOpen(true)}>Open Large Modal</Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Player Analytics" size="lg">
        <p className="text-slate-300">Expanded analytics view with chart slots.</p>
      </Modal>
    </div>
  );
}

export const Large: StoryObj<typeof Modal> = {
  render: () => <ModalLargeDemo />,
};

// ---------------------------------------------------------------------------
// Drawer
// ---------------------------------------------------------------------------
function DrawerDemo() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex h-screen items-center justify-center bg-slate-950 p-8">
      <Button onClick={() => setOpen(true)}>Open Drawer</Button>
      <Drawer open={open} onClose={() => setOpen(false)} title="Filters">
        <p className="text-slate-300">Filter controls and search inputs go here.</p>
      </Drawer>
    </div>
  );
}

export const DrawerStory: StoryObj<typeof Drawer> = {
  name: "Drawer",
  render: () => <DrawerDemo />,
};
