import { Liquid } from '@ant-design/plots';
import React from 'react';

const CompanyReview = () => {
  const config = {
    percent: 0.3,
    style: {
      outlineBorder: 4,
      outlineDistance: 8,
      waveLength: 128,
    },
    width: 200,
    height: 200,
  };

  const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  gap: '24px',               
  padding: '20px',
};

  return (
    <div style={containerStyle}>
      <div>
        <div>긍정</div>
        <Liquid {...config} />
      </div>
      <div>
        <div>부정</div>
        <Liquid {...config} />
      </div>
      <div>
        <div>중립</div>
        <Liquid {...config} />
      </div>
    </div>
  );
};

export default CompanyReview;
