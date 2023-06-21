import React from "react";
import { Image } from "cloudinary-react";
import { useNavigate } from "react-router-dom";

const ProfilePicture = (props) => {
    const navigate = useNavigate();

    return (
        <div 
            onClick={() => {
                switch (props.type) {
                    case 'user':
                        navigate("/profile/"+props.user);
                        break;
                    case 'group':
                        navigate("/group/info/"+props.group);
                        break;
                    default:
                        navigate("/");
                }
            }}
            style={{
                cursor: "pointer",
                backgroundColor: "rgb(255, 255, 255, 0.1)",
                width: `${props.size}px`,
                height: `${props.size}px`,
                borderRadius: '50%',
                display: 'flex',
                overflow: 'hidden'
            }}
        >
            <Image
                cloudName={`${process.env.REACT_APP_IMAGECLOUD}`}
                publicId={`${props.picture || "Member_qx5vfp"}`}
                width= {`${props.size}px`}
                length= {`${props.size}px`}>
            </Image>
        </div>
    )
}

export default ProfilePicture;