import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  centerKeyword: "엔비디아", 
  relatedKeywords: [
    { name: "미국", value: 1282 },
    { name: "시장", value: 711 },
    { name: "달러", value: 1398 },
    { name: "반도체", value: 845 },
    { name: "AI", value: 1304 },
    { name: "트럼프", value: 944 },
    { name: "한국", value: 1176 },
    { name: "주식", value: 678 },
    { name: "관세", value: 1059 },
    { name: "투자", value: 1409 },
    { name: "주가", value: 899 },
    { name: "금리", value: 1293 },
    { name: "삼성전자", value: 763 },
    { name: "기업", value: 1222 },
    { name: "증시", value: 1090 }
  ],
};

const associationSlice = createSlice({
    name: 'association',
    initialState,
    reducers: {
        updateAssociation: (state, action) => {
            return {...state, ...action.payload};
        }
    }
});

export const {updateAssociation} = associationSlice.actions;
export default associationSlice.reducer;