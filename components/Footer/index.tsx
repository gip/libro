import { Divider } from "../Divider";

export const Footer = () => (
  <footer className="mt-auto mb-8">
    <Divider />
    <div className="text-center mt-4 text-xs">
      <div><i>Memorioso is currently in the <a href="/p/2" className="text-blurple hover:underline">Make It Work</a> stage.</i></div>
      <div className="mt-2">
        <a href="/terms" className="text-blurple hover:underline">Terms of Use</a>
        <span className="mx-4">•</span>
        <a href="/privacy" className="text-blurple hover:underline">Privacy Policy</a>
      </div>
    </div>
  </footer>
)
