import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import "./Profile.css";
import { auth } from "@/firebase-config";

const Profile = () => {
  // const { userDetails, loading } = useContext(UserContext);
  const [userDetails, setUserDetails] = useState(null);

  const onLogout = async () => {
    console.log("logout");

    // localStorage.removeItem("userDetails");
    
    try {
      await auth.signOut().then(() => {
        localStorage.clear();
        window.location.reload();
        console.log("Signed out successfully");
      });
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };


  useEffect(() => {
    console.log("userDetails", userDetails);
    const localuserDetails = JSON.parse(localStorage.getItem("userDetails"));
    console.log("🚀 ~ useEffect ~ localuserDetails:", localuserDetails);
    if (localuserDetails) {
      setUserDetails(localuserDetails);
    }
  }, []);

  const columnMenu = [
    {
      title: "Logout",
      disable: false,
      value: "edit",
      click: (value) => {
        onLogout();
      },
      styleClass: "default",
    },
  ];

  return (
    <div className="user-profile">
      {userDetails ? (
        <>
          <DropdownMenu className="dark">
            <DropdownMenuTrigger asChild>
              <div className="user-profile-container flex items-center gap-2">
                <Avatar>
                  <AvatarImage
                    src={userDetails.photoURL}
                    alt={userDetails.displayName}
                  />
                  <AvatarFallback>
                    {userDetails.displayName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="user-name text-white">
                  {userDetails.displayName}
                </span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="dark">
              <DropdownMenuGroup>
                {columnMenu.map((option, index) => (
                  <DropdownMenuItem
                    className={option?.styleClass}
                    key={index}
                    disabled={option?.disabled}
                    onClick={() => option?.click(option?.value)}
                  >
                    <span>
                      {option?.title && !option?.subMenu && option?.title}
                    </span>
                    {option.shortcut && (
                      <DropdownMenuShortcut>
                        {option.shortcut}
                      </DropdownMenuShortcut>
                    )}

                    {option?.subMenu && (
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                          {option?.title}
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent>
                            {option?.subMenu?.map(
                              (subMenuOption, subMenuIndex) => (
                                <DropdownMenuItem
                                  key={subMenuIndex}
                                  disabled={subMenuOption?.disabled}
                                >
                                  {subMenuOption?.title}
                                </DropdownMenuItem>
                              )
                            )}
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      ) : (
        <p>No user logged in</p>
      )}
    </div>
  );
};

export default Profile;
