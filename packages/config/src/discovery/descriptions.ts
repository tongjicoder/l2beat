import type { Permission, RolePermissionEntries } from '@l2beat/discovery'

export const UltimatePermissionToPrefix: {
  [key in Permission]: string | undefined
} = {
  interact: 'Is allowed to interact with',
  upgrade: 'Can upgrade the implementation of',
  act: undefined,
  guard: 'A Guardian',
  challenge: 'A Challenger',
  propose: 'A Proposer',
  sequence: 'A Sequencer',
  validate: 'A Validator',
  operateLinea: 'An Operator',
  fastconfirm: 'A FastConfirmer',
  validateZkStack: 'A Validator',
  relay: 'A Relayer',
  validateBridge: 'A Validator',
  validateBridge2: 'A Validator',
  validateBridge3: 'A Validator',
  aggregatePolygon: 'A trusted Aggregator',
  operateStarknet: 'An Operator',
  operateStarkEx: 'An Operator',
  governStarknet: 'A Governor',
  member: 'Is a member of',
}

export const RoleDescriptions: {
  [key in (typeof RolePermissionEntries)[number]]: {
    name: string
    description: string
  }
} = {
  sequence: {
    name: 'Sequencer',
    description:
      'Allowed to commit transactions from the current layer to the host chain.',
  },
  propose: {
    name: 'Proposer',
    description:
      'Allowed to post new state roots of the current layer to the host chain.',
  },
  challenge: {
    name: 'Challenger',
    description:
      'Allowed to challenge or delete state roots proposed by a Proposer.',
  },
  guard: {
    name: 'Guardian',
    description:
      'Allowed to pause withdrawals. In op stack systems with a proof system, the Guardian can also blacklist dispute games and set the respected game type (permissioned / permissionless).',
  },
  validate: {
    // ORBIT specific
    name: 'Validator',
    description:
      'Orbit stack specific Proposer and Challenger role. Can propose new state roots (called nodes) and challenge state roots on the host chain.',
  },
  operateLinea: {
    // LINEA specific
    name: 'Operator',
    description:
      'Allowed to prove blocks and post the corresponding transaction data.',
  },
  fastconfirm: {
    name: 'AnyTrust FastConfirmer',
    description:
      'Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root.',
  },
  validateZkStack: {
    // ZK stack specific
    name: 'Validator',
    description:
      'Permissioned to call the functions to commit, prove, execute and revert L2 batches through the ValidatorTimelock in the main Diamond contract.',
  },
  validateBridge: {
    name: 'Validator',
    description:
      'Permissoned to sign messages (state roots) encoding transfer information or governance actions such as updates to a new validator set, which are decoded onchain with signature checks.',
  },
  validateBridge2: {
    name: 'Validator',
    description:
      'Permissoned to sign crosschain messages encoding transfer information, which are decoded onchain with signature checks. The validators listed here are the default validators for Ethereum and can be overridden by a custom configuration.',
  },
  validateBridge3: {
    name: 'Validator',
    description:
      'Permissioned to sign crosschain messages, attesting to their validity.',
  },
  relay: {
    name: 'Relayer',
    description:
      'Permissioned to relay messages that are then verified onchain.',
  },
  aggregatePolygon: {
    name: 'Trusted Aggregator (Proposer)',
    description:
      'Permissioned to post new state roots and global exit roots accompanied by ZK proofs.', // and accounting proofs for CDK sovereign (others) chains
  },
  operateStarknet: {
    name: 'Operator',
    description:
      'Permissioned to regularly update the state of the L2 on L1. Each state update must have been proven via the SHARP verifier and contains state diffs for data availability.',
  },
  operateStarkEx: {
    name: 'Operator',
    description:
      'Permissioned to regularly update the state roots of the L2 on L1. Each state update must have been proven via the SHARP verifier and contains commitments to the data that is itself kept offchain.',
  },
  governStarknet: {
    name: 'Governor',
    description:
      'Permissioned to manage the Operator role, finalize state and change critical parameters like the programHash, configHash, or message cancellation delay in the core contract.',
  },
}
