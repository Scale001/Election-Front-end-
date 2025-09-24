import NotFoundImage from "../assets/media/404.png"
import "../assets/styles/homepage.css";

export default function NotFound() {
  return (
    <div className="not-found">
      <img src={NotFoundImage} alt="not found" className="notFound"/>
    </div>
  );
}