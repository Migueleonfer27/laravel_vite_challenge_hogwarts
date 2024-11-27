import * as bootstrap from 'bootstrap';
import {buildHeader, showLogoutButton} from "../../components/buildHeader";
import {buildFooter} from "../../components/buildFooter";
import {loadPage} from "../../js/router";
import {buildLoader, hideLoader, showLoader} from "../../components/buildLoader";



buildLoader()
showLoader()
buildHeader()
showLogoutButton()
buildFooter()
