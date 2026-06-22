import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import "../styles/home.css";


const ProfilePage = () => {
  const {t} = useTranslation();
  const navigate = useNavigate();

  return (
<p>ez a user oldal</p>
  );
};

export default ProfilePage;
