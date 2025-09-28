import Image from 'next/image'

const Logo = ({height, width}: {height: number, width:number}) => {
  return (
    <Image
      src="/logo.png"
      width={height}
      height={width}
      alt="LOGO"
    />
  )
}

export default Logo
