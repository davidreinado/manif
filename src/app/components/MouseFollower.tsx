// import React, { useEffect, useState } from 'react';

// export default function MouseFollower() {
//   const [position, setPosition] = useState({ x: 0, y: 0 });

//   useEffect(() => {
//     const handleMouseMove = (e) => {
//       setPosition({ x: e.clientX, y: e.clientY });
//     };

//     window.addEventListener('mousemove', handleMouseMove);
//     return () => window.removeEventListener('mousemove', handleMouseMove);
//   }, []);

//   const style = {
//     position: 'fixed',
//     top: position.y,
//     left: position.x,
//     transform: 'translate(-50%, -50%)',
//     width: '30px',
//     height: '30px',
//     borderRadius: '50%',
//     backgroundColor: 'cyan',
//     pointerEvents: 'none', // allows clicking through the shape
//   };

//   return <div style={style}></div>;
// }
