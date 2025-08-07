import React from 'react'

const ReviewTest = ({ data }) => {
  const { company, review } = data;

  return (
    <div>
      {company && "기업명 : " + company.name}<br />
      {review && "총 리뷰 수 : " + Math.round(review.total_count) + "개"}<br />
      {review && "평균 만족도 : " + Math.round(review.avg_score) + "점"}<br />
      {review && "장점 평균 만족도 : " + Math.round(review.pros_avg_score) + "점"}<br />
      {review && "단점 평균 만족도 : " + Math.round(review.cons_avg_score) + "점"}
    </div>
  )
}

export default ReviewTest