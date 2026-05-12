// Tutorial tip definitions. Two rounds: a normal round (id 1, THE SANDWICH
// INCIDENT) and an inverse round (id 47, THE CODE REVIEW).
//
// Each tip fires the FIRST time its `trigger` event happens in its round
// AND its `when` predicate passes (if any). After firing, the tip's id is
// recorded in shownTipIds and won't fire again — even on tutorial replay
// within the same game, but localStorage is NOT touched so the next time
// the player launches the tutorial they get all tips again.
//
// Triggers:
//   - 'round_start'  : fires once when the round's PLAYING state begins
//   - 'slop_found'   : fires on a successful slop click (any tier). Payload: { isDict, isInverse }
//   - 'wrong_click'  : fires on a wrong click. Payload: {}

export const TUTORIAL_ROUND_IDS = [1, 47];

export const TUTORIAL_TIPS = {
  // Round 0 — normal slop hunt
  1: [
    {
      id: 'normal_start',
      trigger: 'round_start',
      title: '🎓 ROUND 1 OF 2 — SPOT THE SLOP',
      text: "The AI wrote a wall of sloppy text. Click any phrase or word that sounds like generic AI fluff to score. Bigger hand-tagged phrases (like \"As an AI language model\") pay 60-200 pts.",
    },
    {
      id: 'normal_first_hand',
      trigger: 'slop_found',
      when: e => !e.isDict,
      title: '🎯 NICE CATCH',
      text: "That was a hand-tagged phrase. Chain more catches within ~2 seconds to build a COMBO multiplier — up to 3×. Combo decays if you slow down.",
    },
    {
      id: 'normal_first_dict',
      trigger: 'slop_found',
      when: e => e.isDict,
      title: '🔍 DICTIONARY HIT',
      text: "Small dict-tier catch — universal slop words (\"robust\", \"truly\", \"holistic\") pay a flat 25-40 pts. No combo, no shouty commentary. Pure bonus for reading carefully.",
    },
    {
      id: 'normal_first_wrong',
      trigger: 'wrong_click',
      title: '❌ NOT SLOP',
      text: "That word wasn't slop — −50 pts and your combo resets. Be picky. When in doubt, don't click.",
    },
  ],

  // Round 1 — inverse
  47: [
    {
      id: 'inverse_start',
      trigger: 'round_start',
      title: '🔄 ROUND 2 OF 2 — RULES REVERSED',
      text: "Now the AI text is the decoy. Find the HUMAN thoughts hiding inside — short, real, often emotional. Every wrong click costs −150 pts here, so read before you click.",
    },
    {
      id: 'inverse_first_human',
      trigger: 'slop_found',
      title: '✅ HUMAN FOUND',
      text: "Real human thought! Inverse rounds pay 2× per find. Keep scanning — there are usually 2-3 hidden human phrases per round.",
    },
  ],
};

export function getTipsForRound(roundId) {
  return TUTORIAL_TIPS[roundId] || [];
}
