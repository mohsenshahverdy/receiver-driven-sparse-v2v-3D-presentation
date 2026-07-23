import { Line } from '@react-three/drei';

export function CommunicationArrow({from,to,color='#49c6ff',dense=false,reverse=false}) {
  const starts=dense?[-1.2,-.6,0,.6,1.2]:[0];
  return <group>{starts.map((offset,i)=>{const a=[from[0]+offset,from[1]+i*.04,from[2]],b=[to[0]+offset*.25,to[1],to[2]];return <Line key={i} points={reverse?[b,a]:[a,b]} color={color} lineWidth={dense?1.2:2.5} dashed dashScale={2} dashSize={.3} gapSize={.18}/>})}</group>;
}
