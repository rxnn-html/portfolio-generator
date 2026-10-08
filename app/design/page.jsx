import Link from "next/link";
import Card from "@/components/ui/Card";
import SectionHeading from "@/components/home/SectionHeading";

export const metadata = { title: "Design Notes | Portfolio Generator" };

const palette = [
  { name: "Indigo", hex: "#4f46e5", role: "Primary buttons, links, active states" },
  { name: "Violet", hex: "#7c3aed", role: "Middle of the brand gradient" },
  { name: "Fuchsia", hex: "#d946ef", role: "End of the gradient, highlights" },
  { name: "Amber", hex: "#fcd34d", role: "Accent in the Creative template" },
  { name: "Emerald", hex: "#10b981", role: "Success and completed steps" },
  { name: "Red", hex: "#dc2626", role: "Delete actions and errors" },
  { name: "Slate", hex: "#0f172a", role: "Text and dark surfaces" },
];

const elements = [
  { title: "Line", text: "Hairline dividers separate sections in the Simple template. In the Creative template, a vertical line with dots forms the timeline." },
  { title: "Shape", text: "Rounded rectangles mean \"container\" (cards, inputs, buttons). Circles are used for profile photos and step markers." },
  { title: "Negative space", text: "Generous padding around the hero and large gaps between sections keep the page calm and let the headline stand out." },
  { title: "Volume", text: "Not used on purpose. Screens are 2D, so depth is only hinted at with soft shadows and a small lift on hover." },
  { title: "Value", text: "Light and dark values create clarity: dark hero blocks with light text, and muted gray for secondary text." },
  { title: "Colour", text: "See the palette below." },
  { title: "Texture", text: "Only implied texture: soft blurred glows and gradients. The app follows a flat design style." },
];

const principles = [
  { title: "Unity", text: "One component kit (components/ui), one spacing rhythm, and one palette are reused on every page." },
  { title: "Gestalt", text: "Proximity groups related fields inside numbered section cards. Similarity makes every skill the same chip shape." },
  { title: "Hierarchy", text: "Page title is largest, then the subtitle, then body text. The primary action is filled, secondary actions are outlined." },
  { title: "Balance", text: "The Home hero is asymmetrical: heavy text on the left two thirds balanced by the template fan on the right third. The Simple template is symmetrical." },
  { title: "Contrast", text: "Red is reserved for delete actions and errors, and green for success. The same colour never means two different things." },
  { title: "Scale", text: "The hero headline is the biggest element. Step numbers and labels are deliberately small." },
  { title: "Dominance", text: "On the Home page, \"Create Portfolio\" is the only large, filled call to action, so the eye goes there first." },
];

const dimensions = [
  { title: "1D Words", text: "Buttons use verbs (\"Save and choose template\", \"Yes, delete it\"). Error messages say what to fix." },
  { title: "2D Visuals", text: "Icons support the labels. Typography sets the hierarchy." },
  { title: "3D Physical space", text: "Buttons are at least 44 px tall for touch. The Save bar is sticky so it stays reachable on a phone." },
  { title: "4D Time", text: "A spinner shows while saving, a toast confirms success, and the template switches instantly. Data stays online, so users can resume later." },
  { title: "5D Behaviour", text: "A confirmation dialog protects the delete action. If a save fails halfway, the server undoes it." },
];

function Group({ title, items }) {
  return (
    <section className="space-y-5">
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <Card key={item.title} className="p-5">
            <h3 className="font-semibold text-gray-900">{item.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-gray-600">{item.text}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}

export default function DesignPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-16">
      <SectionHeading
        eyebrow="Design notes"
        title="How the design principles are applied"
        text="Elements and principles of visual design, the rule of thirds, interaction design, and colour theory, mapped to this project."
      />

      <Group title="Elements of visual design" items={elements} />
      <Group title="Principles of visual design" items={principles} />

      <section className="space-y-5">
        <h2 className="text-2xl font-bold text-gray-900">Rule of thirds</h2>
        <Card className="p-6 text-sm leading-relaxed text-gray-600">
          <p>
            The Home hero is built on a three-column grid. The headline and call to
            action sit in the left two thirds, and the template visual fills the right
            third. Press <strong>Show rule-of-thirds grid</strong> on the{" "}
            <Link href="/" className="font-semibold text-indigo-600 underline">Home page</Link>{" "}
            to see the grid lines and intersections over the hero.
          </p>
          <p className="mt-3">
            The rule is a guide, not a law. Following the lesson&apos;s warnings, the
            layout avoids crowding the intersections, and on phones it stacks into a
            single column so it stays usable on small screens.
          </p>
        </Card>
      </section>

      <Group title="The 5 dimensions of interaction design" items={dimensions} />

      <section className="space-y-5">
        <h2 className="text-2xl font-bold text-gray-900">Colour theory</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {palette.map((color) => (
            <Card key={color.name} className="overflow-hidden">
              <div className="h-16" style={{ backgroundColor: color.hex }} />
              <div className="p-4">
                <p className="font-semibold text-gray-900">{color.name}</p>
                <p className="font-mono text-xs text-gray-500">{color.hex}</p>
                <p className="mt-2 text-sm text-gray-600">{color.role}</p>
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-6 text-sm leading-relaxed text-gray-600">
          <p>
            <strong>Scheme:</strong> the brand gradient is <em>analogous</em> (indigo,
            violet, fuchsia sit beside each other on the wheel), which feels harmonious.
            Amber, on the opposite side of the wheel, is a <em>complementary</em> accent
            used sparingly for energy in the Creative template.
          </p>
          <p className="mt-3">
            <strong>Temperature:</strong> cool blues and violets dominate, which suits a
            calm, trustworthy tool. Warm amber adds contrast. <strong>Value and
            saturation:</strong> dark mode lowers brightness and softens saturated
            tints so large areas don&apos;t glare.
          </p>
          <p className="mt-3">
            <strong>Accessibility:</strong> colour is never the only signal. Errors
            include text, completed steps include a check icon, and the delete button
            says &quot;Delete.&quot; Colour meanings can differ across cultures, so
            usability testing with real users is the next step.
          </p>
        </Card>
      </section>
    </div>
  );
}