import Image from 'next/image'

const HeroImage = () => (
  <Image
    src="/images/rugpull_with_text.png" // Route of the image file
    height={288} // Desired size with correct aspect ratio
    width={288} // Desired size with correct aspect ratio
    alt="Rug Pull, For Sure logo"
  />
)

export default HeroImage