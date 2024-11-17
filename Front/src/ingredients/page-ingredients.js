import {buildHeader, showLogoutButton} from "../components/buildHeader";
import {buildFooter} from "../components/buildFooter";

const initPagePotions = async () => {
    buildHeader();
    buildFooter();
    showLogoutButton();
};

initPagePotions();