
const Logo = ({themeVariant= 'default'}) => {
  const logo = themeVariant==='default'? 'logo.png':`${themeVariant}-logo.png`;
  const logoPath = `${process.env.PUBLIC_URL}/logo_images/${logo}`;
  return <img src={logoPath} alt="App Logo" width="100" />;
};

export default Logo;
