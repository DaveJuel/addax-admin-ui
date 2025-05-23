// themes/colorLoader.js
import defaultColors from '../assets/scss/themes/default.module.scss';
import ideaChallengeColors from '../assets/scss/themes/idea-challenge.module.scss';
import revolutionWorkshopColors from '../assets/scss/themes/revolution-workshop.module.scss';

const colorThemes = {
  default: defaultColors,
  'idea-challenge': ideaChallengeColors,
  'revolution-workshop': revolutionWorkshopColors
};

export default function getThemeColors(appKey) {
  return colorThemes[appKey] || defaultColors;
}
