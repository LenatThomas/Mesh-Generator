import torch
import os
import warnings
from shap_e.diffusion.sample import sample_latents
from shap_e.diffusion.gaussian_diffusion import diffusion_from_config
from shap_e.models.download import load_model, load_config
from shap_e.util.notebooks import decode_latent_mesh
from shap_e.util.image_util import load_image
warnings.filterwarnings("ignore")



class ShapEPipe():
    def __init__(self):
        self._device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self._xm = load_model('transmitter', device=self._device)
        self._model = load_model('text300M', device=self._device)
        self._imageModel = load_model('image300', device = self._device)
        self._diffusion = diffusion_from_config(load_config('diffusion'))

    def generate(self, prompt , batch_size = 1, guidance = 15.0):
        try :
            batch_size = batch_size
            guidance_scale = guidance
            latents = sample_latents(
                batch_size=batch_size,
                model= self._model,
                diffusion=self._diffusion,
                guidance_scale=guidance_scale,
                model_kwargs=dict(texts=[prompt] * batch_size),
                progress=True,
                clip_denoised=True,
                use_fp16=True,
                use_karras=True,
                karras_steps=64,
                sigma_min=1e-3,
                sigma_max=160,
                s_churn=0,
            )
            os.makedirs('./static/outputs/', exist_ok=True)
            for i, latent in enumerate(latents):
                t = decode_latent_mesh(self._xm, latent).tri_mesh()
                with open(f'./static/outputs/generated_{i}.obj', 'w') as f:
                    t.write_obj(f)

            return True
        
        except Exception as e:
            return False

    def generateFromImage(self, image ,batch_size = 1 , guidance = 3.0):
        image = load_image("example_data/corgi.png")
        latents = sample_latents(
            batch_size=batch_size,
            model=self._imageModel,
            diffusion=self._diffusion,
            guidance_scale=guidance,
            model_kwargs=dict(images=[image] * batch_size),
            progress=True,
            clip_denoised=True,
            use_fp16=True,
            use_karras=True,
            karras_steps=64,
            sigma_min=1e-3,
            sigma_max=160,
            s_churn=0,
        )
        os.makedirs('./static/outputs/', exist_ok=True)
        for i, latent in enumerate(latents):
            t = decode_latent_mesh(self._xm, latent).tri_mesh()
            with open(f'./static/outputs/generated_{i}.obj', 'w') as f:
                t.write_obj(f)
        return True
                
    def generateFromImage():
        pass
        
    @property
    def name(self):
        return 'Shap-E'
        
    @property
    def device(self):
        return self._device
        
    def generatedummy(self, prompt , batch_size = 1 , guidance = 15.0):
        self._run = True
        print(prompt , batch_size , guidance)

class Instant3DPipe:
    def __init__(self):
        pass

class Zero123Pipe:
    def __init__(self):
        pass

class HyungyuanPipe:
    def __init__(self):
        pass

class DreamfusionPipe:
    def __init__(self):
        pass

