import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { preview } from '../assets';
import { getRandomPrompt } from '../utils';
import { FormField, Loader } from '../components';

const CreatePost = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    prompt: '',
    photo: '',
  });

  const [generatingImg, setGeneratingImg] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSurpriseMe = () => {
    const randomPrompt = getRandomPrompt(form.prompt);
    setForm({ ...form, prompt: randomPrompt });
  };

  const generateImage = async () => {
    if (form.prompt) {
      try {
        setGeneratingImg(true);
        const response = await fetch('https://server-dall-e.vercel.app/api/v1/dalle', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: form.prompt,
          }),
        });

        const data = await response.json();
        setForm({ ...form, photo: `data:image/jpeg;base64,${data.photo}` });
      } catch (err) {
        alert(err);
      } finally {
        setGeneratingImg(false);
      }
    } else {
      alert('Please provide proper prompt');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.prompt && form.photo) {
      setLoading(true);
      try {
        const response = await fetch('https://server-dall-e.vercel.app/api/v1/post', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...form }),
        });

        await response.json();
        alert('Success');
        navigate('/');
      } catch (err) {
        alert(err);
      } finally {
        setLoading(false);
      }
    } else {
      alert('Please generate an image with proper details');
    }
  };

  return (
    <section className="max-w-7xl mx-auto">
      <div>
        <h1 className="font-extrabold text-[#222328] text-[32px]">Create</h1>
        <p className="mt-2 text-[#666e75] text-[14px] max-w-[500px]">Generate an imaginative image through DALL-E AI and share it with the community</p>
      </div>
    
    <div className=' mt-20 p-4 rounded-md bg-[#ebe9e9]'>
        <h1 className='font-bold font-mono text-[#fe0000]'>Jangan Refresh Page ini !!!</h1>
        <h4 className='text-sm font-mono '>
          Jika terjadi error, silahkan paste kembali link ini & reload page nya <a href='https://client-dall-e.vercel.app/' className='text-blue-800 font-bold'>https://client-dall-e.vercel.app/</a>
        </h4>
      </div>

      <form className="mt-10 max-w-3xl" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-5">
          <FormField
            labelName="Your Name"
            type="text"
            name="name"
            placeholder="Ex., john doe"
            value={form.name}
            handleChange={handleChange}
          />

          <FormField
            labelName="Prompt"
            type="text"
            name="prompt"
            placeholder="An Impressionist oil painting of sunflowers in a purple vase…"
            value={form.prompt}
            handleChange={handleChange}
            isSurpriseMe
            handleSurpriseMe={handleSurpriseMe}
          />
             
           <div className=' p-4 rounded-md bg-[#ebe9e9]'>
            <h1 className='font-bold font-mono text-[#fe0000]'>Warning !!!</h1>
            <h4 className='text-sm font-mono '>Instruksi Penggunaan Dall-E / Stable Diffusion 2.0</h4>

            <p className='text-sm bg-gray-600 p-3 rounded-lg font-mono text-white mt-4 mb-4'>sebelumnya mohon maaf atas ketidaknyamanannya karena ada beberapa prompt yang tidak bisa dijalankan karena keterbasatan aplikasi, berikut tata cara penggunaan AI Dall-E :</p >
            <ul className='mt-4 mb-10 list-disc px-4'>
              <li>Minimal kata yang digunakan didalam <span className='text-blue-700 font-bold'>Prompt</span> adalah 4-5 kata</li>
              <li>Ada beberapa aktor, benda, atau tempat yang tidak bisa dimunculkan karena keterbatasan sumber</li>
              <li>Jadi jika terjadi <span className='text-[#fe0000] font-bold'>Error</span> saat kalian men-generate, silahkan paste link ini di url kalian & reload kembali website nya <a href='https://client-dall-e.vercel.app/' className='text-blue-800 font-bold'>https://client-dall-e.vercel.app/</a> </li>
              <li>Jika ingin sharing hasil gambar yang telah di generate, pastikan isi kolom <span className='text-blue-700 font-bold'>Nama</span> dan <span className='text-blue-700 font-bold'>Prompt</span> nya </li>
            </ul>
            <span className='font-bold'>- Dzy</span>


          </div>

          <div className="relative bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-64 p-3 h-64 flex justify-center items-center">
            { form.photo ? (
              <img
                src={form.photo}
                alt={form.prompt}
                className="w-full h-full object-contain"
              />
            ) : (
              <img
                src={preview}
                alt="preview"
                className="w-9/12 h-9/12 object-contain opacity-40"
              />
            )}

            {generatingImg && (
              <div className="absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg">
                <Loader />
              </div>
            )}
          </div>
        </div>

        <div className="mt-5 flex gap-5">
          <button
            type="button"
            onClick={generateImage}
            className=" text-white bg-green-700 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            {generatingImg ? 'Generating...' : 'Generate'}
          </button>
        </div>

        <div className="mt-10">
          <p className="mt-2 text-[#666e75] text-[14px]">** Once you have created the image you want, you can share it with others in the community **</p>
          <button
            type="submit"
            className="mt-3 text-white bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            {loading ? 'Sharing...' : 'Share with the Community'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default CreatePost;
