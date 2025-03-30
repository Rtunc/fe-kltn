import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const Wind = () => {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <DotLottieReact
        src="https://lottie.host/0f2f3984-4eac-4a7c-8c83-7ce37c0e4437/mc9PPZR4K2.lottie"
        style={{ width: '100%', height: '100%' }}
        autoplay
        loop
        renderer="svg"
        background="transparent"
      />
    </div>
  );
};

export default Wind;