import { compose } from 'redux'
import { bumpTool } from '../common/player'
import { spendInventory } from '../common'
import { ToolUpgradeCosts } from '../constants'

const payForTool = ({ G, ctx, args: [{ tool }] }) => ({
  G: {
    ...G,
    players: {
      ...G.players,
      [ctx.currentPlayer]: {
        ...G.players[ctx.currentPlayer],
        inventory: spendInventory(
          G.players[ctx.currentPlayer].inventory,
          ToolUpgradeCosts[tool]
        ),
      },
    },
  },
  ctx,
  args: [{ tool }],
})

const bumpToolComposable = ({ G, ctx, args: [{ tool }] }) =>
  bumpTool({ G, ctx }, tool)

const clearAction = ({ G, ctx, args }) => ({
  G: { ...G, action: null },
  ctx,
  args,
})

export const passIfNoOtherWorkshops = ({ G, ctx, ...args }) => {
  console.log('passing if none other', G.unusedWorkshops[ctx.currentPlayer])
  return {
    G: {
      ...G,
      passed: {
        ...G.passed,
        [ctx.currentPlayer]: G.unusedWorkshops[ctx.currentPlayer].length === 0,
      },
    },
    ctx,
    ...args,
  }
}

export default ({ G, ctx, args }) =>
  compose(
    passIfNoOtherWorkshops,
    bumpToolComposable,
    payForTool,
    clearAction
  )({ G, ctx, args }).G
