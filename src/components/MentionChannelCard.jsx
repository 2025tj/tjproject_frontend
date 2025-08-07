import React from 'react';
import { Card } from 'antd';
import '../CSS/channelNews.css'

const MentionChannelCard = () => {

  return (
    <article className="news-card">
  <div className="card-header">
    
    <div>
      <h3 className="user-name">회사 이름</h3>
    </div>
  </div>

  <ul className="project-list">
    <li>
      <a href="#" className="project-item">
        <strong className="project-title">Project A</strong>
        <p className="project-desc">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime consequuntur deleniti,
          unde ab ut in!
        </p>
      </a>
    </li>
    <li>
      <a href="#" className="project-item">
        <strong className="project-title">Project B</strong>
        <p className="project-desc">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente cumque saepe sit.
        </p>
      </a>
    </li>
    <li>
      <a href="#" className="project-item">
        <strong className="project-title">Project A</strong>
        <p className="project-desc">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime consequuntur deleniti,
          unde ab ut in!
        </p>
      </a>
    </li>
    <li>
      <a href="#" className="project-item">
        <strong className="project-title">Project A</strong>
        <p className="project-desc">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime consequuntur deleniti,
          unde ab ut in!
        </p>
      </a>
    </li>
  </ul>
</article>

  );
};

export default MentionChannelCard;
