import React from 'react';

import * as Introspection from 'typescript-introspection';
import { Clients, Stores } from '@pitaman71/omniglot-live-data';

import * as Debug from './Debug';
import ImageSkeleton from './ImageSkeleton';
import * as Models from 'omniglot-live-media-models'

import './Assets.css';

let logEnable = false;

type Asset = Introspection.getValueType<typeof Models.Assets.AssetDomain>;

const Context = React.createContext<undefined|{
    baseURI: string
}>(undefined);

export function Provide(props: React.PropsWithChildren<{
    baseURI: string
}>) {
    return <Context.Provider value={props}>{props.children}</Context.Provider>
}

export function useBaseURI() {
    const context = React.useContext(Context);
    if(!context?.baseURI) throw new Error('Missing Context, expected <Media.ViewAsset.Provide> above this node in the JSX hierarchy');
    return context.baseURI;
}

function getDownloadURL(baseURI: string, path: string, mime: string) {
    const searchParams = new URLSearchParams({ path, mime })
    return fetch(`${baseURI}/media/download?${searchParams}`, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
}

function makeDataUrl(blob: Blob) {
    return new Promise<string>((resolve, reject) =>{
        let reader = new FileReader();
        reader.onload = () => { resolve(reader.result as string) } ;
        reader.readAsDataURL(blob) ;
    });
}

function downloadBlob(signedURL: string) {
    return fetch(signedURL, { 
        method: 'GET',
        headers: {
            "Content-Type": "image/jpeg"
        }
    }).then(response => response.blob());
}

/**
 * given a media asset that has already been uploaded to the cloud, 
 * display it as a React element in read-only form
 */
export function Downloader(props: {
    style?: React.CSSProperties,
    domain?: Introspection.Domain<Asset>,
    value?: Asset,
    client?: Clients.ScalarClient<Asset>
}) {
    const baseURI = useBaseURI();
    const [ dataURL, setDataURL ] = React.useState<string>();

    React.useEffect(() => {
        const words = props.value?.uri?.split('/') || [];
        let mime = props.value?.mime;
        if(!mime && (props.value?.uri?.endsWith('.jpeg') || props.value?.uri?.endsWith('.jpg')))
            mime = 'image/jpeg';
        if(words.length == 0 || !mime) {
            // skip
        } else if(words.length > 2 && words[0] === '' && words[1] === 'images') {
            getDownloadURL(baseURI, words.slice(1).join('/'), mime)
            .then(({ signedUrl }) => downloadBlob(signedUrl))
            .then(blob => makeDataUrl(blob))
            .then(dataUrl_ => setDataURL(dataUrl_));            
        } else if(words[0] == '' && words[1] == 'media')
            getDownloadURL(baseURI, words[2], mime)
            .then(({ signedUrl }) => downloadBlob(signedUrl))
            .then(blob => makeDataUrl(blob))
            .then(dataUrl_ => setDataURL(dataUrl_));
    }, [props.value]);

    const mime = !dataURL ? undefined : dataURL.substring(dataURL.indexOf(":")+1, dataURL.indexOf(";"));
    const src = dataURL === undefined ? undefined : dataURL.replace('quicktime', 'mp4');
    var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    return (
        <Debug.Boundary name='Controls.Media._AsDownloader'>
            <React.Fragment>
                { !isSafari && !!mime && mime.split('/')[0] !== 'image' ? [] : 
                  <img 
                    className="media-asset-image" 
                    style={props.style} 
                    src={src}
                  /> 
                }
                { isSafari || !mime || mime.split('/')[0] !== 'video' ? [] : 
                  <video 
                    className="media-asset-video" 
                    style={props.style} 
                    src={src} 
                    autoPlay={true}
                  /> 
                }
            </React.Fragment>
        </Debug.Boundary>
    )
}

export function Metadata(props: {
    domain?: Introspection.Domain<Asset>,
    value?: Asset,
    client?: Clients.ScalarClient<Asset>
}) {
    const pixelDimensions = props.value?.pixelDimensions;
    const mime = props.value?.mime;
    const isImage = mime === undefined && !!props.value ? true : mime?.split('/')[0] === 'image';
    const isVideo = mime?.split('/')[0] === 'video';
    const empty = () => (<React.Fragment></React.Fragment>);

    return !pixelDimensions ? empty() : isVideo === true ? <p>Video {pixelDimensions?.width} x {pixelDimensions.height}</p> : isImage === true ? <p>Image {pixelDimensions?.width} x {pixelDimensions.height}</p> : empty();
}