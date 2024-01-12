import { varTranEnter, varTranExit } from './transition';

// ----------------------------------------------------------------------

export const varFade = (props) => {
  const distance = props?.distance || 120;
  const durationIn = props?.durationIn;
  const durationOut = props?.durationOut;
  const easeIn = props?.easeIn;
  const easeOut = props?.easeOut;

  return {
    // IN
    in: {
      initial: { opacity: 0 },
      animate: { opacity: 1, transition: varTranEnter },
      exit: { opacity: 0, transition: varTranExit }
    },
    inUp: {
      initial: { y: distance, opacity: 0 },
      animate: { y: 0, opacity: 1, transition: varTranEnter({ durationIn, easeIn }) },
      exit: { y: distance, opacity: 0, transition: varTranExit({ durationOut, easeOut }) }
    },
    inDown: {
      initial: { y: -distance, opacity: 0 },
      animate: { y: 0, opacity: 1, transition: varTranEnter({ durationIn, easeIn }) },
      exit: { y: -distance, opacity: 0, transition: varTranExit({ durationOut, easeOut }) }
    },
    inLeft: {
      initial: { x: -distance, opacity: 0 },
      animate: { x: 0, opacity: 1, transition: varTranEnter({ durationIn, easeIn }) },
      exit: { x: -distance, opacity: 0, transition: varTranExit({ durationOut, easeOut }) }
    },
    inRight: {
      initial: { x: distance, opacity: 0 },
      animate: { x: 0, opacity: 1, transition: varTranEnter({ durationIn, easeIn }) },
      exit: { x: distance, opacity: 0, transition: varTranExit({ durationOut, easeOut }) }
    },

    // OUT
    out: {
      initial: { opacity: 1 },
      animate: { opacity: 0, transition: varTranEnter({ durationIn, easeIn }) },
      exit: { opacity: 1, transition: varTranExit({ durationOut, easeOut }) }
    },
    outUp: {
      initial: { y: 0, opacity: 1 },
      animate: { y: -distance, opacity: 0, transition: varTranEnter({ durationIn, easeIn }) },
      exit: { y: 0, opacity: 1, transition: varTranExit({ durationOut, easeOut }) }
    },
    outDown: {
      initial: { y: 0, opacity: 1 },
      animate: { y: distance, opacity: 0, transition: varTranEnter({ durationIn, easeIn }) },
      exit: { y: 0, opacity: 1, transition: varTranExit({ durationOut, easeOut }) }
    },
    outLeft: {
      initial: { x: 0, opacity: 1 },
      animate: { x: -distance, opacity: 0, transition: varTranEnter({ durationIn, easeIn }) },
      exit: { x: 0, opacity: 1, transition: varTranExit({ durationOut, easeOut }) }
    },
    outRight: {
      initial: { x: 0, opacity: 1 },
      animate: { x: distance, opacity: 0, transition: varTranEnter({ durationIn, easeIn }) },
      exit: { x: 0, opacity: 1, transition: varTranExit({ durationOut, easeOut }) }
    }
  };
};

// ----------------------------------------------------------------------

const DISTANCE = 120;

// ----------------------------------------------------------------------

const TRANSITION_ENTER = {
  duration: 0.64,
  ease: [0.43, 0.13, 0.23, 0.96]
};
const TRANSITION_EXIT = {
  duration: 0.48,
  ease: [0.43, 0.13, 0.23, 0.96]
};

export const varFadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: TRANSITION_ENTER },
  exit: { opacity: 0, transition: TRANSITION_EXIT }
};

export const varFadeInUp = {
  initial: { y: DISTANCE, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: TRANSITION_ENTER },
  exit: { y: DISTANCE, opacity: 0, transition: TRANSITION_EXIT }
};

export const varFadeInLeft = {
  initial: { x: -DISTANCE, opacity: 0 },
  animate: { x: 0, opacity: 1, transition: TRANSITION_ENTER },
  exit: { x: -DISTANCE, opacity: 0, transition: TRANSITION_EXIT }
};

export const varFadeInDown = {
  initial: { y: -DISTANCE, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: TRANSITION_ENTER },
  exit: { y: -DISTANCE, opacity: 0, transition: TRANSITION_EXIT }
};

export const varFadeInRight = {
  initial: { x: DISTANCE, opacity: 0 },
  animate: { x: 0, opacity: 1, transition: TRANSITION_ENTER },
  exit: { x: DISTANCE, opacity: 0, transition: TRANSITION_EXIT }
};

export const varFadeOut = {
  initial: { opacity: 1 },
  animate: { opacity: 0, transition: TRANSITION_ENTER },
  exit: { opacity: 1, transition: TRANSITION_EXIT }
};

export const varFadeOutUp = {
  initial: { y: 0, opacity: 1 },
  animate: { y: -DISTANCE, opacity: 0, transition: TRANSITION_ENTER },
  exit: { y: 0, opacity: 1, transition: TRANSITION_EXIT }
};

export const varFadeOutDown = {
  initial: { y: 0, opacity: 1 },
  animate: { y: DISTANCE, opacity: 0, transition: TRANSITION_ENTER },
  exit: { y: 0, opacity: 1, transition: TRANSITION_EXIT }
};

export const varFadeOutLeft = {
  initial: { x: 0, opacity: 1 },
  animate: { x: -DISTANCE, opacity: 0, transition: TRANSITION_ENTER },
  exit: { x: 0, opacity: 1, transition: TRANSITION_EXIT }
};

export const varFadeOutRight = {
  initial: { x: 0, opacity: 1 },
  animate: { x: DISTANCE, opacity: 0, transition: TRANSITION_ENTER },
  exit: { x: 0, opacity: 1, transition: TRANSITION_EXIT }
};
