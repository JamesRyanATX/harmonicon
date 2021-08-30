export const monoSynth = async ({ library }) => {

  library.instrument('mono-synth', async ({ instrument }) => {
    return new Tone.MonoSynth({
      volume: -8,
      detune: 0,
      portamento: 0,
      envelope: {
        attack: 0,
        attackCurve: "exponential",
        decay: 0,
        decayCurve: "exponential",
        release: 0.1,
        releaseCurve: "exponential",
        sustain: 0.1
      },
      oscillator: {
        partialCount: 0,
        partials: [],
        phase: 0,
        type: "sine",
        harmonicity: 0,
        modulationType: "sine"
      }
    });
  });

};
