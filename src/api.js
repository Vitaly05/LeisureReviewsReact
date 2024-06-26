import axios from "axios";
import { login, logout } from "./redux/slices/authSlice";
import store from "./redux/store";

// eslint-disable-next-line no-undef
const apiUrl = process.env.NODE_ENV === "development" ? "/api" : `${process.env.REACT_APP_API_HOST}/api`;

const api = axios.create({
    baseURL: apiUrl,
    withCredentials: true
});

api.interceptors.request.use(setAccessToken);

function setAccessToken(request) {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
        request.headers.Authorization = `bearer ${accessToken}`;
    }
    return request;
}

api.interceptors.response.use(function(response) {
    return response;
}, function(error) {
    if (error.response?.status === 401) {
        const refreshToken = localStorage.getItem("refreshToken");
        const accessToken = localStorage.getItem("accessToken");
        if (!(refreshToken || accessToken)) {
            return Promise.reject(error);
        }
        api.post("account/refresh", {
            accessToken: accessToken,
            refreshToken: refreshToken
        }).then(function(refreshResponse) {
            if (refreshResponse.status === 200) {
                localStorage.setItem("accessToken", refreshResponse.data.accessToken);
                localStorage.setItem("refreshToken", refreshResponse.data.refreshToken);
                store.dispatch(login());
                api(error.config);
            } else {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                store.dispatch(logout());
            }
        }).catch(() => {
            store.dispatch(logout());
        });
    }
    return Promise.reject(error);
});

export const getCurrentUserInfo = () => {
    api.get("account/get-account-info")
        .then(response => {
            setAccountInfo(response.data);
        }).catch(reason => {
            if (reason.response?.status === 401) {
                console.log("Unauthorized");
            }
        });
};

export const checkAccessToCreateReview = (authorId, onSuccess, onError) => {
    api.get(`account/check-create-review-access/${authorId}`).then(response => {
        if (response.status === 200) {
            onSuccess();
        }
    }).catch(onError);
};

export const checkAccessToEditReview = (reviewId, onSuccess, onError) => {
    api.get(`account/check-edit-review-access/${reviewId}`).then(response => {
        if (response.status === 200) {
            onSuccess();
        }
    }).catch(onError);
};

export const checkAccessToLikeReview = (reviewId, onSuccess) => {
    api.get(`reviews/can-like/${reviewId}`).then(response => {
        if (response.status === 200) {
            onSuccess(response.data);
        }
    }).catch(defaultErrorHandler);
};

export const signIn = (data, onSuccess, onError, onFinally) => {
    api.post("account/sign-in", {
        username: data.username,
        password: data.password
    }).then(response => {
        if (response.status === 200) {
            setTokens(response.data);
            getCurrentUserInfo();
            onSuccess();
        }
    }).catch(onError).finally(onFinally);
};

export const signUp = (data, onSuccess, onError, onFinally) => {
    api.post("account/sign-up", {
        username: data.username,
        password: data.password
    }).then(response => {
        if (response.status === 200) {
            setTokens(response.data);
            getCurrentUserInfo();
            onSuccess();
        }
    }).catch(onError).finally(onFinally);
};

export const signOut = () => {
    store.dispatch(logout());
    sessionStorage.removeItem("currentUser");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
};

export const googleSignIn = (credential, onSuccess, onRedirect) => {
    api.post("account/google-sign-in", {
        tokenId: credential
    }).then(response => {
        if (response.status === 200) {
            setTokens(response.data);
            getCurrentUserInfo();
            onSuccess();
        }
    }).catch(err => {
        if (err.response.data.code === 5) {
            onRedirect();
        }
    });
};

export const googleSignUp = (username, credential, onSuccess, onError, onFinally) => {
    api.post(`account/google-sign-up?username=${username}`, {
        tokenId: credential
    }).then(response => {
        if (response.status === 200) {
            setTokens(response.data);
            getCurrentUserInfo();
            onSuccess();
        }
    }).catch(err => {
        const code = err.response?.data.code;
        if (code) {
            onError(code);
        }
    }).finally(onFinally);
};

export const getReviewsPage = (page, sortTarget, sortType, leisureGroup, onSuccess) => {
    api.get(`reviews/get-page/${page}/${sortTarget}/${sortType}${leisureGroup && `?leisureGroup=${leisureGroup}`}`)
        .then(response => {
            if (response.status === 200) {
                onSuccess(response.data);
            }
        }).catch(defaultErrorHandler);
};

export const getUserReviews = (username, page, sortTarget, sortType, onSuccess) => {
    api.get(`reviews/get-user-page/${username}/${page}/${sortTarget}/${sortType}`)
        .then(response => {
            if (response.status === 200) {
                onSuccess(response.data);
            }
        }).catch(defaultErrorHandler);
};

export const getReviewsPageByTags = (page, sortTarget, sortType, tags, leisureGroup, onSuccess) => {
    if (tags.length === 0) {
        getReviewsPage(page, sortTarget, sortType, leisureGroup, onSuccess);
    } else {
        api.get(`reviews/get-tags-page/${page}/${sortTarget}/${sortType}?tags=${tags.join("&tags=")}${leisureGroup ? `&leisureGroup=${leisureGroup}` : ""}`)
            .then(response => {
                if (response.status === 200) {
                    onSuccess(response.data);
                }
            }).catch(defaultErrorHandler);
    }
};

export const getReviewPagesCount = (onSuccess) => {
    api.get("reviews/get-pages-count")
        .then(response => {
            if (response.status === 200) {
                onSuccess(response.data);
            }
        }).catch(defaultErrorHandler);
};

export const getUserReviewPagesCount = (username, onSuccess) => {
    api.get(`reviews/get-user-pages-count?username=${username}`)
        .then(response => {
            if (response.status === 200) {
                onSuccess(response.data);
            }
        }).catch(defaultErrorHandler);
};

export const getReviewPagesCountByTags = (tags, leisureGroup, onSuccess) => {
    const params = [
        tags.length > 0 ? `tags=${tags.join("&tags=")}` : null,
        `leisureGroup=${leisureGroup}`
    ];
    const urlString = [
        "reviews/get-tags-pages-count",
        params.filter(p => p !== null).join("&")
    ].join("?");
    api.get(urlString)
        .then(response => {
            if (response.status === 200) {
                onSuccess(response.data);
            }
        }).catch(defaultErrorHandler);
};

export const getLeisureInfo = (leisureId, onSuccess) => {
    api.get(`leisures/get-info/${leisureId}`)
        .then(response => {
            if (response.status === 200) {
                onSuccess(response.data);
            }
        }).catch(defaultErrorHandler);
};

export const getUserInfo = (username, onSuccess, onError) => {
    api.get(`users/get-info?username=${username}`)
        .then(response => {
            if (response.status === 200) {
                onSuccess(response.data);
            }
        }).catch(error => {
            if (error.name === "AxiosError" && error.response.status === 404) {
                onError();
            }
        });
};

export const getUserInfoById = (userId, onSuccess) => {
    api.get(`users/get-info-by-id/${userId}`)
        .then(response => {
            if (response.status === 200) {
                onSuccess(response.data);
            }
        }).catch(defaultErrorHandler);
};

export const getUserNameById = (userId, onSuccess, onError) => {
    api.get(`users/get-username/${userId}`)
        .then(response => {
            if (response.status === 200) {
                onSuccess(response.data);
            } 
        }).catch(error => {
            if (error.name === "AxiosError" && error.response.status === 404) {
                onError();
            }
        });
};

export const saveReview = (reviewInfo, onSuccess, onError) => {
    api.post("/reviews/save-review", reviewInfo).then(response => {
        if (response.status === 200) {
            onSuccess(response.data);
        }
    }).catch(onError);
};

export const deleteReview = (reviewId, onSuccess, onError, onFinally) => {
    api.delete(`/reviews/delete-review/${reviewId}`).then(response => {
        if (response.status === 200) {
            onSuccess();
        }
    }).catch((error) => {
        if (error.name === "AxiosError") {
            onError();
        }
    }).finally(() => onFinally());
};

export const getReview = (reviewId, onSuccess, onError) => {
    api.get(`/reviews/get-review/${reviewId}`).then(response => {
        if (response.status === 200) {
            onSuccess(response.data);
        }
    }).catch(error => {
        if (error.name === "AxiosError" && error.response.status === 404) {
            onError();
        }
    });
};

export const getRelatedReviews = (reviewId, onSuccess) => {
    api.get(`/reviews/get-related-reviews/${reviewId}`).then(response => {
        if (response.status === 200) {
            onSuccess(response.data);
        }
    }).catch(defaultErrorHandler);
};

export const likeReview = (reviewId, onSuccess, onFinally) => {
    api.post(`/reviews/like-review/${reviewId}`).then(response => {
        if (response.status === 200) {
            onSuccess();
        }
    }).catch(defaultErrorHandler).finally(onFinally);
};

export const getRate = (leisureId, onSuccess) => {
    api.get(`/leisures/get-rate/${leisureId}`).then(response => {
        if (response.status === 200) {
            onSuccess(response.data);
        }
    }).catch(defaultErrorHandler);
};

export const rateLeisure = (leisureId, value, onSuccess) => {
    api.post(`/leisures/rate/${leisureId}/${value}`).then(response => {
        if (response.status === 200) {
            onSuccess(response.data);
        }
    }).catch(defaultErrorHandler);
};

export const getUsersPagesCount = (onSuccess, onForbid) => {
    api.get("/users/get-pages-count").then(response => {
        if (response.status === 200) {
            onSuccess(response.data);
        }
    }).catch(reason => {
        if (reason?.response.status === 403 || reason?.response.status === 401) {
            onForbid();
        }
    });
};

export const getUsersPage = (page, onSuccess, onForbid, onFinally) => {
    api.get(`/users/get-page/${page}`).then(response => {
        if (response.status === 200) {
            onSuccess(response.data);
        }
    }).catch(reason => {
        if (reason?.response.status === 403 || reason?.response.status === 401) {
            onForbid();
        }
    }).finally(onFinally);
};

export const changeUserStatus = (username, status, onSuccess) => {
    api.post("/users/change-status", {
        userName: username,
        status: status
    }).then(response => {
        if (response.status === 200) {
            onSuccess(response.data);
        }
    }).catch(defaultErrorHandler);
};

export const makeAdmin = (username, onSuccess) => {
    api.post("/users/change-role", {
        userName: username,
        role: 0
    }).then(response => {
        if (response.status === 200) {
            onSuccess();
        }
    }).catch(defaultErrorHandler);
};

export const getTagsWeights = (onSuccess) => {
    api.get("/tags/get-weights").then(response => {
        if (response.status === 200) {
            onSuccess(response.data);
        }
    }).catch(defaultErrorHandler);
};

export const getCurrentUserCommentRate = (commentId, onSuccess, onFinally) => {
    api.get(`comments/get-current-user-rate?commentId=${commentId}`)
        .then(response => {
            if (response.status === 200) {
                onSuccess(response.data);
            }
        }).catch(defaultErrorHandler).finally(onFinally);
};


const defaultErrorHandler = (error) => {
    if (error.name === "AxiosError") {
        if (error.response.status === 404)
            console.error("Server connection error");
        
        if (error.response.status === 401)
            console.log("Unauthorized");
    } else {
        console.error(error);
    }
};

const setAccountInfo = (responseData) => {
    if (responseData) {
        store.dispatch(login());
        sessionStorage.setItem("currentUser", JSON.stringify({
            username: responseData.userName,
            id: responseData.id
        }));
    }
};

const setTokens = (responseData) => {
    localStorage.setItem("accessToken", responseData.accessToken);
    localStorage.setItem("refreshToken", responseData.refreshToken);
};