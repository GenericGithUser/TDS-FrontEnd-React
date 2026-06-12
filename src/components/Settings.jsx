import { Popover } from "@base-ui/react";
import { Menu } from "@base-ui/react";
import { IoSettings } from "react-icons/io5";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { BiSolidLogOutCircle } from "react-icons/bi";
import { GiPadlock } from "react-icons/gi";
import '../styles/settings.css';

function Settings(){
    const { logout } = useAuth();
    return (
      <>
        <Menu.Root>
          <Menu.Trigger className={"buttonBack"}>
            <IoSettings className="setButton" />
          </Menu.Trigger>
          <Menu.Portal>
            <Menu.Positioner sideOffset={5}>
              <Menu.Popup className={"menu"}>
                <Menu.Arrow />
                <Menu.Item>
                  <Link
                    to={"passwordchange"}
                    style={{ textDecoration: "none" }}
                  >
                    <button type="button" className="changePassword btnMenu">
                      <GiPadlock style={{ width: "2vw", height: "2vw" }} />{" "}
                      Change Password
                    </button>
                  </Link>
                </Menu.Item>
                <Menu.Item>
                  <button
                    type="button"
                    className="logOut btnMenu"
                    onClick={logout}
                  >
                    <BiSolidLogOutCircle
                      style={{ width: "2vw", height: "2vw" }}
                    />{" "}
                    Log Out
                  </button>
                </Menu.Item>
              </Menu.Popup>
            </Menu.Positioner>
          </Menu.Portal>
        </Menu.Root>
      </>
    );
}

export default Settings;