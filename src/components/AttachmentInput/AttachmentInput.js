import { Div, File, FormItem, Spinner } from '@vkontakte/vkui'
import './AttachmentInput.css'
import { Icon24CameraOutline } from '@vkontakte/icons'
import { useState } from 'react'
import bridge from '@vkontakte/vk-bridge'
import { upload } from '../../server'
import { useStorage } from '../../hooks/useStorage'
import { Snack } from '../Snack/Snack'

const openImage = (imglist, index) => {
    bridge.send('VKWebAppShowImages', {images:imglist, start_index:index})
}

export const AttachmentInput = ({onAttach=(e)=>{}}) => {

    const [images, setImages] = useState([])
    const [fetching, setFetching] = useState(false)

    let {
        setSnackbar
    } = useStorage()

    // function attachFile(e){
    //     setFetching(true)
    //     const file = e.target.files[0];
    //     const reader = new FileReader();

    //     reader.onloadend = function() {
    //         const base64String = reader.result.split(',')[1];
    //         setImages([...images, base64String])
    //         onAttach(base64String)
    //         setFetching(false)
    //     };

    //     if (file) {
    //         reader.readAsDataURL(file);
    //     }
    // }

    async function attachFile(e){
        setFetching(true)
        let file = e.target.files[0]
        if(!['image/jpg', 'image/jpeg', 'image/png', 'image/heic'].includes(file.type)){
            setSnackbar(<Snack mode='error'>Неверный тип файла</Snack>, 'innewpost')
            setFetching(false)
            return;
        }
        if(file.size/(1024*1024) > 3){
            setSnackbar(<Snack mode='error'>Максимальный размер фотографии 3 мб</Snack>, 'innewpost')
            setFetching(false)
            return;
        }
        let upload_req = await upload(e.target)

        if(upload_req.image){
            setImages([...images, upload_req.image])
            onAttach(upload_req.image)
        }else{
            setSnackbar(<Snack mode='error'>{upload_req.message ? upload_req.message : 'Не удалось загрузить фотографию'}</Snack>, 'innewpost')
        }
        setFetching(false)
    }

    return(
        <div className = 'attachinput_container'>
            <Div className='attachinput_attachments'>
                {images.map((img,i)=>{
                    return(
                        <img 
                        onClick={()=>openImage(images, i)}
                        key={i}
                        className='attachinput_image' 
                        src={img}/>
                    )
                })}
            </Div>
            <div className='attachinput_add'>
                <FormItem bottom='Прикрепите фотографии к записи (3Мб)'>
                    <File 
                    accept=".jpg, .jpeg, .png, .heic"
                    onChange={attachFile}
                    before={fetching ? <Spinner size='medium' /> : <Icon24CameraOutline />} size='l' mode='secondary'/>
                </FormItem>
            </div>
        </div>
    )
}




export const BaseImagesCollection = ({collection=[], ...restProps}) => {
    let images_url = collection.map(image=>image.content.photo)

    return(
    <>
    <div className='attachinput_attachments' {...restProps}>
        {collection.map((att,i)=>{
            return(
                <img 
                onClick={()=>openImage(images_url, i)}
                key={att.attachment_id} 
                className='attachinput_image_big' 
                src={att.content.photo}
                />
            )
        })}
    </div>
    </>
    )
}
