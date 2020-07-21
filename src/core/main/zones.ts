import zoneA0 from '../../assets/levels/zoneA0.json';
import zoneA1 from '../../assets/levels/zoneA1.json';
import zoneB0 from '../../assets/levels/zoneB0.json';
import zoneB1 from '../../assets/levels/zoneB1.json';
import zoneB2 from '../../assets/levels/zoneB2.json';
import zoneB3 from '../../assets/levels/zoneB3.json';
import cloudsBack from '../../assets/images/default/background/clouds-back.png';
import cloudsFront from '../../assets/images/default/background/clouds-front.png';
import bgBack from '../../assets/images/default/background/bg-back.png';
import bgFront from '../../assets/images/default/background/bg-front.png';
import defaultTileSet from '../../assets/images/default/default-tileset.png';
import sunnyLandTileSet from '../../assets/images/sunny-land/sunny-land-tileset.png';
import defaultImages from '../../assets/images/default/images.png';
import defaultImagesMap from '../../assets/sprite-maps/default/images.json';

const zones: Zones = {
  'zoneA0': {
    config: zoneA0,
    tileset: defaultTileSet,
    backgrounds: {
      cloudsBack,
      cloudsFront,
      bgBack,
      bgFront,
    },
    images: {
      spriteSheet: defaultImages,
      spriteMap: defaultImagesMap,
    }
  },
  'zoneA1': {
    config: zoneA1,
    tileset: defaultTileSet,
    backgrounds: {
      cloudsBack,
      cloudsFront,
    },
    images: {
      spriteSheet: defaultImages,
      spriteMap: defaultImagesMap,
    }
  },
  'zoneB0': {
    config: zoneB0,
    tileset: sunnyLandTileSet,
    backgrounds: {},
    images: {},
  },
  'zoneB1': {
    config: zoneB1,
    tileset: sunnyLandTileSet,
    backgrounds: {},
    images: {},
  },
  'zoneB2': {
    config: zoneB2,
    tileset: sunnyLandTileSet,
    backgrounds: {},
    images: {},
  },
  'zoneB3': {
    config: zoneB3,
    tileset: sunnyLandTileSet,
    backgrounds: {},
    images: {},
  },
};

export default zones;
