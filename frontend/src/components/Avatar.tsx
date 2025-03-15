interface AvatarProps {
    avatarUrl: string;
}

const Avatar: React.FC<AvatarProps> = ({ avatarUrl }) => {
    // 頭像圖片的顯示，如果是預設頭像，則使用預設圖片；否則顯示動態 URL 來強制刷新圖片
    const src = avatarUrl === '/default_avatar.jpg'
        ? '/default_avatar.jpg'
        : `${avatarUrl}?${new Date().getTime()}`;
    return <img src={src} alt="Profile Picture" />;
};

export default Avatar;