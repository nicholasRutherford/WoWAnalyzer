import React from 'react';

import Module from 'Parser/Core/Module';
import Enemies from 'Parser/Core/Modules/Enemies';

import SPELLS from 'common/SPELLS';
import SpellIcon from 'common/SpellIcon';
import SpellLink from 'common/SpellLink';
import Combatants from "../../../Core/Modules/Combatants";
import StatisticBox from "../../../../Main/StatisticBox";

class PatientSniper extends Module {

  static dependencies = {
    enemies: Enemies,
    combatants: Combatants,
  };

  /*
  A module to track the effectiveness of the Patient Sniper talent
  > Apply Vulnerable
  > 0-0.99seconds passed = 0%
  > 1-1.99seconds passed = 6%
  > 2-2.99seconds passed = 12%
  > 3-3.99seconds passed = 18%
  > 4-4.99seconds passed = 24%
  > 5-5.99seconds passed = 30%
  > 6-6.99seconds passed = 36%
  > Vulnerable fades from the target
  */

  //The various levels of patient sniper
  nonVulnerableAimedShots = 0;
  zeroSecondsIntoVulnerable = 0;
  oneSecondIntoVulnerable = 0;
  twoSecondsIntoVulnerable = 0;
  threeSecondsIntoVulnerable = 0;
  fourSecondsIntoVulnerable = 0;
  fiveSecondsIntoVulnerable = 0;
  sixSecondsIntoVulnerable = 0;
  lastVulnerableTimestamp = null;
  timeIntoVulnerable = 0;

  on_initialized() {
    this.active = this.combatants.selected.hasTalent(SPELLS.PATIENT_SNIPER_TALENT.id);
  }

  on_byPlayer_cast(event) {
    const spellId = event.ability.guid;
    const eventTimestamp = event.timestamp;
    const enemy = this.enemies.getEntity(event);

    if (spellId !== SPELLS.AIMED_SHOT.id || spellId !== SPELLS.MARKED_SHOT.id) {
      return;
    }
    if (spellId === SPELLS.MARKED_SHOT.id) {
      //vulnerable is reset, so we get new timestamp
      this.lastVulnerableTimestamp = eventTimestamp;
    }
    if (spellId === SPELLS.AIMED_SHOT.id) {
      if (enemy.hasBuff(SPELLS.VULNERABLE.id, event.timestamp)) {
        this.timeIntoVulnerable = eventTimestamp - this.lastVulnerableTimestamp;
        switch (this.timeIntoVulnerable / 1000) {
          case 0:
            this.zeroSecondsIntoVulnerable += 1;
            break;
          case 1:
            this.oneSecondIntoVulnerable += 1;
            break;
          case 2:
            this.twoSecondsIntoVulnerable += 1;
            break;
          case 3:
            this.threeSecondsIntoVulnerable += 1;
            break;
          case 4:
            this.fourSecondsIntoVulnerable += 1;
            break;
          case 5:
            this.fiveSecondsIntoVulnerable += 1;
            break;
          case 6:
            this.sixSecondsIntoVulnerable += 1;
            break;
          default:
            break;
        }
      }
      else {
        this.nonVulnerableAimedShots += 1;
      }
    }
  }
  on_byPlayer_damage(event) {
    const spellId = event.ability.guid;
    const eventTimestamp = event.timestamp;

    //we're only interested in windburst here
    if (spellId !== SPELLS.WINDBURST.id) {
      return;
    }
    else {
      //vulnerable is reset, so we get new timestamp
      this.lastVulnerableTimestamp = eventTimestamp;
    }
    return this.lastVulnerableTimestamp;
  }

  statistic() {
    return (
      <StatisticBox
        icon={<SpellIcon id={SPELLS.PATIENT_SNIPER_TALENT.id} />}
        value={`}
        label={}/>
    )
  }

}

export default PatientSniper;
