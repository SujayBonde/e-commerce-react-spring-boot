import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/Newsletterbox'

const About = () => {
  return (
    <div>
      <div className='text-2xl text-center pt-8 border-t'>
        <Title text1={'ABOUT'} text2={'US'} />
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-16'>
        <img className='w-full md:max-w-[450px]' src={assets.about_img} alt="About StyleBySujay" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
          <p>
            StyleBySujay is your destination for curated fashion that blends elegance, comfort, and individuality. We believe style is a form of self-expression, and our collections are designed to empower you to look and feel your best—every day.
          </p>
          <p>
            From timeless classics to bold trends, we handpick every piece with quality and versatility in mind. Whether you're shopping for a statement outfit or everyday essentials, our platform makes fashion accessible, enjoyable, and uniquely yours.
          </p>
          <b className='text-gray-800'>Our Mission</b>
          <p>
            To inspire confidence through fashion by delivering premium-quality apparel, seamless shopping experiences, and exceptional customer care. We aim to build a community where style meets authenticity.
          </p>
        </div>
      </div>

      <div className='text-xl py-4'>
        <Title text1={'WHY'} text2={'CHOOSE US'} />
      </div>

      <div className='flex flex-col md:flex-row text-sm mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-10 flex flex-col gap-5'>
          <b>Quality Assurance:</b>
          <p className='text-gray-600'>
            Every product is carefully selected and inspected to meet high standards of craftsmanship and durability. We partner with trusted suppliers to ensure your wardrobe lasts beyond seasons.
          </p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-10 flex flex-col gap-5'>
          <b>Convenience:</b>
          <p className='text-gray-600'>
            Enjoy a smooth, intuitive shopping experience with fast delivery, secure payments, and easy returns. Our platform is optimized for mobile and desktop, so you can shop anytime, anywhere.
          </p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-10 flex flex-col gap-5'>
          <b>Exceptional Customer Service:</b>
          <p className='text-gray-600'>
            Our support team is here to help you with sizing, styling, and order queries. We value your trust and strive to make every interaction helpful, friendly, and efficient.
          </p>
        </div>
      </div>

      <NewsletterBox />
    </div>
  )
}

export default About;