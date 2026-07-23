const fig = name => `/thesis/figures/${name}`;

export const STEPS = [
  {
    label: 'Title',
    eyebrow: 'MASTER THESIS · TELECOMMUNICATION ENGINEERING',
    title: 'Receiver-Driven Sparse\nV2V Communication',
    body: 'Mohsen Shahverdikondori · Advisor: Mauran Mizmizi\nTelecommunication Engineering · Politecnico di Milano',
    camera: [17, 20, 32],
    target: [3.7, 0, 6.2],
    visual: {
      type: 'metrics',
      title: 'Thesis objective',
      kicker: 'Core claim',
      metrics: [
        { value: '≈10%', label: 'communication budget' },
        { value: '0.9765', label: 'CARLA TTRR@0.7' },
        { value: '91.18%', label: 'missed-risk reduction' }
      ]
    },
    notes: 'Open with the practical tension: cooperative perception helps autonomous vehicles see beyond occlusion, but dense V2V feature exchange is not scalable.'
  },
  {
    label: 'Problem',
    eyebrow: '01  MOTIVATION',
    title: 'What is the\nthesis question?',
    body: 'Cooperative perception helps, but the useful communication decision is not obvious.',
    camera: [16, 18, 28],
    target: [2.8, 0, 5.3],
    visual: {
      type: 'bullets',
      variant: 'narrow',
      title: 'Motivating questions',
      kicker: 'Thesis setup',
      bullets: ['Why does the ego need collaboration in urban scenes?', 'If collaborators can help, do we need full-bandwidth feature sharing?', 'Who should decide what is useful to send: the sender or the receiver?']
    },
    notes: 'Start with the scene-level reason for cooperation before introducing bandwidth or decision ownership.'
  },
  {
    label: 'Ego Need Map',
    eyebrow: '02  EGO VIEW',
    title: 'What does the ego\nmiss?',
    body: 'From behind the ego, some objects are weak, partial, or absent in its local features.',
    camera: [3.05, 2.25, 14.25],
    target: [3.05, 1.05, 5.9],
    visual: null,
    notes: 'Camera should feel like a driver-side/ego-side street view, not a top-down map.'
  },
  {
    label: 'Collaborator View',
    eyebrow: '03  COMPLEMENTARY VIEW',
    title: 'A collaborator\nsees differently',
    body: 'Another vehicle can observe useful context hidden from the ego receiver.',
    camera: [8.05, 2.45, 7.15],
    target: [7.9, 1.05, -1.2],
    visual: null,
    notes: 'Use collaborator markers to make clear this information comes from the collaborator, not magic global knowledge.'
  },
  {
    label: 'Bandwidth Question',
    eyebrow: '04  BANDWIDTH QUESTION',
    title: 'Should we send\nall features?',
    body: 'Full communication is informative, but most feature cells are not equally useful to the receiver.',
    camera: [14.5, 11.5, 18.5],
    target: [4.6, .15, 5.7],
    visual: {
      type: 'bullets',
      title: 'Is every feature useful?',
      kicker: 'Communication pressure',
      bullets: ['Full BEV feature sharing can recover context, but it consumes high bandwidth.', 'Many transmitted cells are redundant, already known, stale, or irrelevant for the ego’s current uncertainty.', 'The goal is to communicate less while preserving the receiver-relevant information.']
    },
    notes: 'Show a dense communication stream here, but frame it as a useful upper reference rather than a deployable assumption.'
  },
  {
    label: 'Decision Maker',
    eyebrow: '05  DECISION MAKER',
    title: 'Who decides\nwhat matters?',
    body: 'The sender knows what it sees; the receiver knows what it is missing.',
    camera: [12.5, 8.8, 16.2],
    target: [4.9, .35, 7.2],
    visual: {
      type: 'bullets',
      title: 'Decision ownership',
      kicker: 'Sender or receiver?',
      bullets: ['Sender-side selection knows local saliency.', 'But the sender may not know what the ego actually lacks.', 'If the sender transmits misleading or wrong information, legal accountability becomes harder to assign.', 'Receiver-side selection starts from ego uncertainty and asks only for useful missing context.']
    },
    notes: 'This is the intellectual handoff from motivation to method: decision ownership belongs to the receiver.'
  },
  {
    label: 'BEV Fusion',
    eyebrow: '06  FEATURE BOUNDARY',
    title: 'What exactly\nis communicated?',
    body: 'Requests operate on intermediate bird’s-eye-view feature cells, before final detection.',
    camera: [14.6, 12.8, 19.2],
    target: [4.4, .1, 5.4],
    visual: {
      type: 'figure',
      title: 'Intermediate BEV fusion',
      image: fig('fusion_strategy_comparison.png'),
      caption: 'BEV features are learned spatial feature maps in a top-down road grid. Intermediate fusion shares these features before the detector outputs final boxes.'
    },
    notes: 'Bridge from decision ownership to method definition: the thesis selects cells in intermediate BEV feature space, not raw point clouds or final detections.'
  },
  {
    label: 'BEV Grid',
    eyebrow: '07  METHOD START',
    title: 'One BEV grid,\nfive policies',
    body: 'All methods operate on the same intermediate BEV feature grid; only the communication policy changes.',
    camera: [13.8, 11.8, 18.4],
    target: [4.4, .2, 5.4],
    visual: {
      type: 'figure',
      title: 'Five communication policies',
      image: fig('communication_policy_comparison_v2.png'),
      caption: 'All five policies operate on the same intermediate BEV feature grid; only the communication decision changes.'
    },
    notes: 'First list the five methods, then explain them one by one.'
  },
  {
    label: 'Full Communication',
    eyebrow: '08  UPPER REFERENCE',
    title: 'Full communication',
    body: 'The collaborator sends every intermediate BEV cell to the ego receiver.',
    camera: [11.2, 7.2, 14.4],
    target: [4.7, .55, 7.2],
    visual: null,
    notes: 'Use this as the expensive upper reference before sparse communication policies.'
  },
  {
    label: 'Top-K',
    eyebrow: '09  BASELINE',
    title: 'Top-K:\nthe sender decides',
    body: 'The collaborator sends its highest-energy BEV cells, independent of ego uncertainty.',
    camera: [11.2, 7.2, 14.4],
    target: [4.7, .55, 7.2],
    visual: {
      type: 'methodCard',
      title: 'Selective Top-K baseline',
      kicker: 'sender-side BEV policy',
      items: [
        'Uses intermediate BEV feature cells at the shared fusion boundary.',
        'The collaborator ranks its own cells by feature energy; the sender decides what to transmit.',
        'K = 5, 10, 25, and 50 were evaluated to choose the sparse operating point.',
        'Simple and strong, but it does not know which cells the ego actually needs.'
      ],
      note: 'Strong AP baseline, but not receiver-aware.'
    },
    notes: 'Be honest: Top-K is not weak. That makes the receiver-driven comparison more credible.'
  },
  {
    label: 'Snapshot Request',
    eyebrow: '10  RECEIVER REQUEST',
    title: 'Snapshot request:\nego asks first',
    body: 'The ego requests cells where its own evidence is weak and collaborator context is available.',
    camera: [6.8, 8.7, 18.5],
    target: [4.7, .45, 8.7],
    visual: {
      type: 'formula',
      variant: 'snapshot',
      title: 'Snapshot request: receiver-owned score',
      formula: 'Sₑ←ᵢ(u) = N(ego need) · N(collaborator context)',
      bullets: [
        'Ego need = inverse ego feature energy',
        'Context = compact collaborator-side evidence',
        'Soft AND score, then Top-K request mask',
        'Only selected BEV cells cross the V2V link'
      ]
    },
    notes: 'Explain the multiplicative form as a soft AND: the receiver needs it and the collaborator has context.'
  },
  {
    label: 'Temporal Cache',
    eyebrow: '11  TEMPORAL MEMORY',
    title: 'Temporal cache:\ndo not ask again',
    body: 'The receiver remembers recently received context and avoids redundant requests.',
    camera: [9.6, 6.6, 14.5],
    target: [4.8, 1, 8.4],
    visual: {
      type: 'figureBullets',
      title: 'Temporal cache upgrades snapshot',
      kicker: 'receiver-owned memory',
      image: fig('temporal_cache_mechanism.png'),
      bullets: [
        'Start from the same snapshot need × context score.',
        'Store compact collaborator context from previous frames.',
        'Novelty, age, and confidence decide whether old context is still useful.',
        'After selected context is received, update the cache for the next frame.',
        'Request new or stale cells; avoid asking again for recently known evidence.'
      ],
      caption: 'The cache is receiver-owned request state; it is not dense pre-request collaborator feature transmission.'
    },
    notes: 'Emphasize that time matters: consecutive frames are correlated, so requesting unchanged context is wasteful.'
  },
  {
    label: 'Learned Head',
    eyebrow: '12  LEARNED POLICY',
    title: 'Learned head:\npredict the sparse mask',
    body: 'A lightweight CNN combines need, context, cache, novelty, age, and confidence.',
    camera: [4.6, 3.25, 14.55],
    target: [4.45, .92, 6.55],
    visual: {
      type: 'figure',
      variant: 'learnedHead',
      title: 'Learned temporal request head',
      image: fig('learned_temporal_request_head_v2.png'),
      caption: '3,217 trainable request-head parameters; hard Top-K mask at inference.'
    },
    notes: 'Make the learned component sound controlled and small, not like a black-box replacement of the detector.'
  },
  {
    label: 'Learned Ego Ask',
    eyebrow: '13  LEARNED POLICY · EGO',
    title: 'The ego predicts\nwhat to ask',
    body: 'The learned request head turns ego uncertainty into a sparse request mask.',
    camera: [3.75, 2.75, 16.25],
    target: [3.95, .95, 6.85],
    visual: null,
    notes: 'Show the receiver-owned decision: the ego sees weak evidence, predicts a sparse request, and asks the collaborator.'
  },
  {
    label: 'Learned Collaborator',
    eyebrow: '14  LEARNED POLICY · COLLABORATOR',
    title: 'The collaborator\nselects context',
    body: 'The collaborator applies the learned request and sends only selected BEV feature cells.',
    camera: [8.55, 3.4, 9.2],
    target: [8.0, .95, 1.15],
    visual: null,
    notes: 'Make clear that the collaborator sees the bike/front-car context and returns the selected remote evidence.'
  },
  {
    label: 'Learned Ego Receive',
    eyebrow: '15  LEARNED POLICY · FUSION',
    title: 'Sparse context\nreturns to ego',
    body: 'The ego fuses selected remote cells, so hidden actors become available without full communication.',
    camera: [3.55, 2.5, 14.65],
    target: [4.35, .9, 6.2],
    visual: null,
    notes: 'Close the learned-method story by showing the selected collaborator context becoming ego-side evidence.'
  },
  {
    label: 'Evaluation',
    eyebrow: '16  EXPERIMENTAL SETUP',
    title: 'Two datasets,\none evaluation view',
    body: 'A simulated CARLA split and a real-world Culver City split test whether sparse V2V communication stays useful across domains.',
    camera: [16, 15, 20],
    target: [4.2, 0, 5],
    visual: {
      type: 'metrics',
      variant: 'datasetDetail',
      title: 'Evaluation datasets',
      kicker: 'CARLA + Culver City',
      metrics: [
        { value: '2,170', label: 'CARLA 2021-only frames' },
        { value: '550', label: 'Culver City frames' },
        { value: '4', label: 'metric families' }
      ],
      details: [
        {
          title: 'CARLA 2021-only',
          text: 'Controlled simulation split with repeatable V2V geometry, occlusion, and future-pose support for safety proxies.'
        },
        {
          title: 'Culver City',
          text: 'Real-world validation domain with different road layout, object distribution, and sensor appearance.'
        },
        {
          title: 'Same fusion boundary',
          text: 'Detector and intermediate BEV fusion setup stay fixed; the comparison isolates the communication policy.'
        },
        {
          title: 'Measured with',
          text: 'Detection quality, communication ratio, trajectory-time risk recall, and missed-risk reduction.'
        }
      ]
    },
    notes: 'Use this to make the evaluation credible: one controlled simulated domain, one real-world domain, same BEV feature boundary.'
  },
  {
    label: 'AP Definition',
    eyebrow: '17  METRIC DEFINITION',
    title: 'Start with\nAverage Precision',
    body: 'Most perception work reports AP@0.5 and AP@0.7 as global 3D detection quality.',
    camera: [13.5, 12.5, 18],
    target: [4.2, 0, 5.3],
    visual: {
      type: 'formula',
      variant: 'metricDefinition',
      title: 'Average Precision',
      kicker: 'standard detection metric',
      formula: 'AP@τ = area under precision–recall curve, with IoU ≥ τ',
      bullets: [
        'AP@0.5 uses a moderate 3D localization requirement.',
        'AP@0.7 is stricter and more sensitive to position, size, and orientation errors.',
        'Useful for global detection quality, and still reported throughout the thesis.',
        'But AP treats a remote missed object and a trajectory-critical missed object too similarly.'
      ]
    },
    notes: 'Use this as the familiar baseline. Then pivot: AP is necessary, but not sufficient for receiver-driven V2V.'
  },
  {
    label: 'Static Danger Metrics',
    eyebrow: '18  STATIC DANGER METRICS',
    title: 'AP does not say\nwhich miss matters',
    body: 'Danger-aware metrics evaluate objects inside an ego-centric region where missed detections are more relevant.',
    camera: [11.8, 9.7, 17.2],
    target: [3.8, 0, 5.05],
    visual: {
      type: 'figureBullets',
      variant: 'staticMetricDefinition',
      title: 'Static danger-aware metrics',
      kicker: 'receiver-centric proxy',
      image: fig('static_danger_aware_metrics.png'),
      bullets: [
        'Danger-zone recall',
        'Risk-weighted recall',
        'Missed static risk',
        'Missed-risk reduction'
      ],
      caption: 'Static metrics make missed objects near the ego count more than remote misses.'
    },
    notes: 'Verbally explain why this is better than AP but still incomplete: it knows “near the ego,” not “near the future path.”'
  },
  {
    label: 'Trajectory Metrics',
    eyebrow: '19  TRAJECTORY-AWARE PROXIES',
    title: 'Then ask:\nwill ego meet it?',
    body: 'Trajectory-aware metrics weight missed objects by future ego-object proximity and urgency.',
    camera: [13.5, 12.5, 18],
    target: [4.2, 0, 5.3],
    visual: {
      type: 'figureBullets',
      variant: 'trajectoryMetricDefinition',
      title: 'Trajectory-aware metrics',
      kicker: 'future-path relevance',
      image: fig('trajectory_aware_metrics.png'),
      bullets: [
        'Trajectory-zone recall',
        'Trajectory-risk recall',
        'Time-to-closest-approach recall',
        'Trajectory-time risk recall'
      ],
      caption: 'Trajectory-aware metrics ask whether a missed object becomes relevant along the ego future path.'
    },
    notes: 'This is the key transition into the results: AP remains reported, but trajectory-aware metrics better match the receiver-driven motivation.'
  },
  {
    label: 'CARLA Results',
    eyebrow: '20  MAIN RESULT · CARLA',
    title: 'Near-full risk recall\nat sparse budget',
    body: 'Learned temporal request reaches 0.9765 TTRR@0.7 at 0.0983 communication ratio.',
    camera: [18, 17, 24],
    target: [4, 0, 5.2],
    visual: {
      type: 'result',
      variant: 'carlaDetailed',
      title: 'CARLA 2021-only',
      rows: [
        ['Metric', 'Full', 'Top-K', 'Snapshot', 'Temporal', 'Learned'],
        ['AP@0.5', '0.9046', '0.9084', '0.8735', '0.8843', '0.8872'],
        ['AP@0.7', '0.8134', '0.8172', '0.7641', '0.7861', '0.7945'],
        ['Comm. ratio', '1.0000', '0.0953', '0.0983', '0.1057', '0.0983'],
        ['MB/frame', '15.13', '1.440', '1.488', '1.597', '1.488'],
        ['DZR@0.7', '0.9782', '0.9628', '0.8628', '0.8774', '0.9742'],
        ['RWR@0.7', '0.9818', '0.9567', '0.7775', '0.7981', '0.9767'],
        ['TZR@0.7', '0.9819', '0.9610', '0.8123', '0.8276', '0.9777'],
        ['TTRR@0.7', '0.9824', '0.9517', '0.7339', '0.7566', '0.9765'],
        ['COR@0.7', '0.9799', '0.9431', '0.6881', '0.7136', '0.9723'],
        ['MTR reduction', '93.38%', '81.85%', '0.00%', '8.52%', '91.18%']
      ],
      caption: 'DZR/RWR are static danger-aware recalls; TZR/TTRR/COR/MTR are trajectory-aware metrics at IoU 0.7.'
    },
    notes: 'State the nuance: Top-K wins AP on CARLA, learned temporal wins the receiver-relevant safety proxy among sparse receiver methods.'
  },
  {
    label: 'Culver Results',
    eyebrow: '21  VALIDATION · CULVER CITY',
    title: 'The trend\nrepeats elsewhere',
    body: 'Learned temporal request reaches 0.9703 TTRR@0.7 at 0.0904 communication ratio.',
    camera: [18, 17, 24],
    target: [4, 0, 5.2],
    visual: {
      type: 'result',
      variant: 'culverDetailed',
      title: 'Culver City',
      rows: [
        ['Metric', 'Full', 'Top-K', 'Snapshot', 'Temporal', 'Learned'],
        ['AP@0.5', '0.8668', '0.8405', '0.8078', '0.8289', '0.8686'],
        ['AP@0.7', '0.7291', '0.7083', '0.6657', '0.6935', '0.7277'],
        ['Comm. ratio', '1.0000', '0.0873', '0.0904', '0.0978', '0.0904'],
        ['MB/frame', '11.322', '0.989', '1.024', '1.098', '1.024'],
        ['DZR@0.7', '0.9698', '0.9316', '0.8593', '0.8806', '0.9676'],
        ['RWR@0.7', '0.9737', '0.9097', '0.7730', '0.8021', '0.9714'],
        ['TZR@0.7', '0.9880', '0.9134', '0.7458', '0.7775', '0.9845'],
        ['TTRR@0.7', '0.9765', '0.8811', '0.6796', '0.7180', '0.9703'],
        ['COR@0.7', '0.9789', '0.8428', '0.5403', '0.5931', '0.9749'],
        ['MTR reduction', '92.67%', '62.89%', '0.00%', '12.00%', '90.74%']
      ],
      caption: 'Culver repeats the receiver-driven trend: learned temporal approaches full communication with near-10% payload.'
    },
    notes: 'Use Culver as evidence that the receiver-based progression is not only a CARLA artifact.'
  },
  {
    label: 'Qualitative',
    eyebrow: '22  VISUAL VALIDATION',
    title: 'Zoom into\ncritical cases',
    body: 'Qualitative BEV progressions show where sparse receiver-driven context changes detections.',
    camera: [15.5, 14, 19],
    target: [4.2, 0, 5.2],
    visual: {
      type: 'splitFigures',
      variant: 'qualitativeStack',
      title: 'Receiver progression examples',
      figures: [
        { image: fig('carla_frame_000011_receiver_progression.png'), caption: 'CARLA frame 000011' },
        { image: fig('culver_frame_000313_receiver_progression.png'), caption: 'Culver frame 000313' }
      ]
    },
    notes: 'Use this slide as the “show me” moment after the numerical results.'
  },
  {
    label: 'Repository',
    eyebrow: '23  REPRODUCIBLE IMPLEMENTATION',
    title: 'A configurable\nexperiment repo',
    body: 'The implementation keeps the detector fixed and makes the communication policy, metrics, and outputs configurable.',
    camera: [18, 20, 27],
    target: [4, 0, 5.2],
    visual: {
      type: 'bullets',
      variant: 'repoTakeaway',
      title: 'What the repository contains',
      kicker: 'Implementation setup',
      bullets: [
        'YAML approach presets switch between full, Top-K, snapshot, temporal cache, and learned temporal request.',
        'Run-local configs record dataset paths, checkpoints, selected policy, and output locations for each experiment.',
        'Checkpoint/reportability guards prevent untrained learned heads from entering final results.',
        'Evaluation writes AP, communication cost, static danger metrics, trajectory-aware metrics, logs, CSV/YAML summaries, and thesis figures.'
      ],
      caption: 'New experiments are mostly configured by approach name and runtime overrides, not by editing model code.'
    },
    notes: 'Emphasize that the repo is not just the demo: it is a configurable evaluation pipeline with reproducibility artifacts.'
  },
  {
    label: 'Thanks',
    eyebrow: '24  CLOSING',
    title: 'Thank you\nfor your attention',
    body: 'Questions and discussion.',
    camera: [17, 20, 32],
    target: [3.7, 0, 6.2],
    visual: {
      type: 'bullets',
      variant: 'thanks',
      title: 'Trajectory-Aware Receiver-Driven Sparse V2V Communication',
      kicker: 'Master thesis',
      bullets: [
        'Mohsen Shahverdikondori',
        'Telecommunication Engineering · Politecnico di Milano',
        'Advisor: Mauran Mizmizi'
      ]
    },
    notes: 'Final quiet Q&A slide.'
  }
];
