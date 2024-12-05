import { Divider } from "../Divider";

export const Footer = () => <>
  <Divider />
  <div className="text-center mt-4 text-xs">
    <div><i>Libro is currently in the <a href="https://www.perplexity.ai/search/what-the-make-it-work-stage-wh-2iYhHhS4T9CCGkfezjDqwA" className="text-blurple hover:underline">Make It Work</a> stage.</i></div>
    <div className="mt-2">
      <a href="/terms" className="text-blurple hover:underline">Terms of Use</a>
      <span className="mx-4">•</span>
      <a href="/privacy" className="text-blurple hover:underline">Privacy Policy</a>
    </div>
  </div>
</>
    