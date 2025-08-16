import React, { useEffect, useState } from 'react'
import axios from 'axios'

const Ranking = () => {
  const [ranking, setRanking] = useState({})
  const [year, setYear] = useState(2024)
  const [loading, setLoading] = useState(false)
  // const [activeSlide,setActiveSlide]=useState(0)
  const API_BASE_URL = 'http://localhost:8000'
      

  const slideSubs= ['매출액', '영업이익', "순이익"]
  const [slideIndexes, setSlideIndexes] = useState({
    '매출액': 0,
    '영업이익': 0,
    '순이익': 0
  });

    // 자동 슬라이드   4초마다 자동넘김
  useEffect(() => {
    const pass = setInterval(() => {
      // setActiveSlide((prev) => (prev + 1) % slideSubs.length);
    setSlideIndexes(prev => {
        const updated = { ...prev };
        slideSubs.forEach((sub) => {
          const listLength = ranking[sub]?.length || 0;
          const slideLength = Math.max(listLength - 1, 1); // 1위 제외
          updated[sub] = (prev[sub] + 1) % slideLength;
        });
        return updated;
      });
    }, 3000);
    return () => clearInterval(pass);
  }, [ranking]);

 
  useEffect(() => {
    const fetchRanking = async () => {
      setLoading(true)
      try {
        const response = await axios.get(`${API_BASE_URL}/api/companies/ranking/?year=${year}`)
        console.log('API 응답:', response.data)
        setRanking(response.data)
      } catch (error) {
        console.error('API 호출 오류:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchRanking()
  }, [year])

  const formatAmount = (amount) => {
    if (amount >= 1000000000000) {
      return `${(amount / 1000000000000).toFixed(1)}조원`
    } else if (amount >= 100000000) {
      return `${(amount / 100000000).toFixed(1)}억원`
    } else if (amount >= 10000) {
      return `${(amount / 10000).toFixed(1)}만원`
    } else {
      return `${amount}원`
    }
  }
  

  // const current= slideSubs[activeSlide]
  // const currentRanks= ranking[current]?.slice(0,5) || []  //5개 추리기

  return (
    <div style={{ paddingLeft: '50px' , justifyContent: 'center'}}>
      <h4>기업 재무 랭킹</h4>
      
      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => setYear(2022)}>2022</button>
        <button onClick={() => setYear(2023)}>2023</button>
        <button onClick={() => setYear(2024)}>2024</button>
      </div>

      {loading ? (
        <div>로딩 중...</div>
      ) : (
        <div style={{ display: 'flex', gap: '20px' }}>
          {/* 매출액 랭킹 */}
          {/* <div style={{ flex: 1 }}>
            <h2>매출액 랭킹</h2>
            <ol>
              {ranking.매출액 && ranking.매출액.map((company) => (
                <li key={company.name} style={{ marginBottom: '10px' }}>
                  <strong>{company.name}</strong>
                  <br />
                  <span style={{ color: '#666' }}>
                    {formatAmount(company.amount)}
                  </span>
                </li>
              ))}
            </ol>
          </div>  */}
                  {/*
          {/* 영업이익 랭킹 
          <div style={{ flex: 1 }}>
            <h2>영업이익 랭킹</h2>
            <ol>
              {ranking.영업이익 && ranking.영업이익.map((company) => (
                <li key={company.name} style={{ marginBottom: '10px' }}>
                  <strong>{company.name}</strong>
                  <br />
                  <span style={{ color: '#666' }}>
                    {formatAmount(company.amount)}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          {/* 순이익 랭킹 
          <div style={{ flex: 1 }}>
            <h2>순이익 랭킹</h2>
            <ol>
              {ranking.순이익 && ranking.순이익.map((company) => (
                <li key={company.name} style={{ marginBottom: '10px' }}>
                  <strong>{company.name}</strong>
                  <br />
                  <span style={{ color: '#666' }}>
                    {formatAmount(company.amount)}
                  </span>
                </li>
              ))}
            </ol>
          </div> */}
           {slideSubs.map((category) => {
            const companies = ranking[category] || [];
            const top1 = companies[0];
            const rest = companies.slice(1);
            const index = slideIndexes[category] || 0;

            return (
              <div key={category} style={{ flex: 1 }}>
                <h2>{category} </h2>

                {/* 고정된 1위 */}
                {top1 && (
                  <div style={{ background: '#f0f8ff', padding: '10px', borderRadius: '5px', marginBottom: '10px' }}>
                    🥇 <strong>{top1.name}</strong><br />
                    <span style={{ color: '#666' }}>{formatAmount(top1.amount)}</span>
                  </div>
                )}

                {/* 슬라이드되는 2~5위 */}
                <div style={{ height: '50px', overflow: 'hidden', position: 'relative' }}>
                  <div
                    style={{
                      transition: 'transform 0.5s ease-in-out',
                      transform: `translateY(-${index * 50}px)`
                    }}
                  >
                    {/* 2~10순위까지 슬라이드됨 */}
                    {rest.slice(0, 9).map((company, i) => (
                      <div key={i} style={{ height: '50px' }}>
                        {i + 2}위: <strong>{company.name}</strong><br />
                        <span style={{ color: '#888' }}>{formatAmount(company.amount)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  )
}

export default Ranking