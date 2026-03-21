import { getSettings } from '../services/storage';
import * as sounds from '../services/sounds';

export function useSounds() {
  function isEnabled() {
    return getSettings().soundEnabled;
  }

  return {
    playClick:   () => { if (isEnabled()) sounds.playClick(); },
    playFlip:    () => { if (isEnabled()) sounds.playFlip(); },
    playCorrect: () => { if (isEnabled()) sounds.playCorrect(); },
    playWrong:   () => { if (isEnabled()) sounds.playWrong(); },
    playMatch:   () => { if (isEnabled()) sounds.playMatch(); },
  };
}
