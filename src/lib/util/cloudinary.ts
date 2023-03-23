import {
  cloudinary_upload_validator,
  type CloudinaryPhoto
} from '$lib/zod/CloudinaryPhoto';
import { nanoid } from 'nanoid';

type CloudinaryUploadOnCompleteCallback = (
  success: boolean,
  photos: CloudinaryPhoto[]
) => void;
type CloudinaryUploadOnChangeCallback = (
  current: number,
  total: number,
  newest: CloudinaryPhoto
) => void;

const uploadSingle = async (file: File): Promise<CloudinaryPhoto | undefined> => {
  return new Promise<CloudinaryPhoto | undefined>(async (resolve) => {
    const fd = new FormData();

    fd.append('file', file);
    fd.append('public_id', nanoid());
    fd.append('upload_preset', 'public_posts_vzlu0vyc');

    const req = await fetch(`https://api.cloudinary.com/v1_1/dz6ahaem9/upload`, {
      method: 'post',
      body: fd
    });

    const json = await req.json();
    const result = cloudinary_upload_validator.safeParse(json);

    if (result.success) {
      const photo: CloudinaryPhoto = {
        version: result.data.version,
        public_id: result.data.public_id,
        alt_text: result.data.tags && result.data.tags[0] ? result.data.tags[0] : '',
        aws_rek_status:
          result.data.moderation && result.data.moderation[0]
            ? result.data.moderation[0].status
            : 'unknown'
      };

      resolve(photo);
    } else {
      resolve(undefined);
    }
  });
};

export const upload = async (
  files: FileList,
  onChange?: CloudinaryUploadOnChangeCallback,
  onComplete?: CloudinaryUploadOnCompleteCallback
): Promise<CloudinaryPhoto[] | undefined> => {
  return new Promise(async (resolve) => {
    const _list = Array.from(files);

    let photos: CloudinaryPhoto[] = [];
    let _error = false;

    for (let i = 0; i < _list.length; i++) {
      const photo = await uploadSingle(_list[i]);
      if (photo) {
        photos.push(photo);
        if (_list.length > 1 && onChange) onChange(i + 1, _list.length, photo);
      } else {
        _error = true;
        break;
      }
    }

    if (onComplete) onComplete(_error === false, photos);

    if (_error) resolve(undefined);
    else resolve(photos);
  });
};

const cloud = 'dz6ahaem9';

const base_url = () => {
  return `https://res.cloudinary.com/${cloud}/image/upload`;
};

export const getThumbnail = (
  version: number | undefined,
  public_id: string | undefined
) => {
  return `${base_url()}/c_thumb,h_440/v${version}/${public_id}`;
};

export const getNormal = (
  version: number | undefined,
  public_id: string | undefined
) => {
  return `${base_url()}/h_1024/v${version}/${public_id}`;
};

export const getSquare = (
  version: number | undefined,
  public_id: string | undefined
) => {
  return `${base_url()}/c_thumb,w_1280,h_1280/v${version}/${public_id}`;
};

export const getSquareSmall = (
  version: number | undefined,
  public_id: string | undefined
) => {
  return `${base_url()}/c_thumb,w_320,h_320/v${version}/${public_id}`;
};

export const getDownload = (
  version: number | undefined,
  public_id: string | undefined
) => {
  return `${base_url()}/fl_attachment/v${version}/${public_id}`;
};
