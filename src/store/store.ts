import { configureStore } from "@reduxjs/toolkit";

import modelerSlice from "./bpmnReducer";

const store = configureStore({
    
    reducer: {
        bpmn: modelerSlice
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware({
            serializableCheck: false
        });
    }
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;