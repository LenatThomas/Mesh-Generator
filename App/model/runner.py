from Generators import ShapEPipe
import warnings

warnings.filterwarnings("ignore")

prompt = 'A teapot and a cup'
pipe = ShapEPipe()
pipe.generate(prompt = prompt)