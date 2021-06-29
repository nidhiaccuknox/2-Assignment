import { useState, useRef, useEffect, useCallback } from 'react';
import axios from 'axios';
// import { useQuery, QueryClientProvider, QueryClient } from 'react-query';
// import options from "../data.json";
import './multiSelectDropdown.css';


// const queryClient = new QueryClient()

const MultiSelectDropdown = () => {

    const [tags, setTags] = useState([]);
    const [value, setValue] = useState('')
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [options, setOptions] = useState([]);
    const ref = useRef(null);

    var url = 'https://api.instantwebtools.net/v1/passenger?page=0&size=10';

    //with only axios

    async function getData() {
        var result = await axios.get(url);
        setOptions(result.data.data);
        console.log(result.data.data);
    }

    //with react-query and axios

    // const { data, status } = useQuery('data',
    //     () => axios('https://api.instantwebtools.net/v1/passenger?page=0&size=10')
    //         .then(res => res.json()))

    // with react-query and fetch

    // const fetchApi = async () => {
    //     return (await fetch(`https://api.instantwebtools.net/v1/passenger?page=0&size=10`)).json()
    // }
    // const { data, status } = useQuery('dataShow', fetchApi);

    // const { isLoading, error, data, status } = useQuery("repoData", () =>
    //     fetch(
    //         "https://api.github.com/repos/tannerlinsley/react-query"
    //     ).then((res) => res.json())
    // );
    // if (isLoading) return "Loading...";
    // if (error) return "An error has occurred: " + error.message;

    // console.log(data);

    const memoizedCallback = useCallback(() => { getData() });

    useEffect(() => {
        memoizedCallback();
        document.addEventListener("click", close);
        return () => document.removeEventListener("click", close);
    }, []);

    function close(e) {
        setOpen(e && e.target === ref.current);
    }

    function filter(options) {
        return options.filter((option) => option.name.toLowerCase().indexOf(query.toLowerCase()) > -1);
    }

    function displayValue() {

        if (query.length > 0) return query;

        if (value) {
            const trimmedInput = value.name;
            if (trimmedInput.length && !tags.includes(trimmedInput)) {
                setTags(prevState => [...prevState, trimmedInput]);
                setValue('');
            }
            return value.label;
        }
        return "";
    }

    const selectOption = (option) => {
        setQuery("");
        setValue(option)
        setOpen(false);
    }

    const deleteTag = (index) => {
        setTags(prevState => prevState.filter((tag, i) => i !== index))
    }

    return (
        <>

            <div className="dropdown">
                <div className="control">
                    <div className="selected-value">

                        <div className="container">
                            {tags.map((tag, index) => (
                                <div className="tag">
                                    {tag}
                                    <button onClick={() => deleteTag(index)}>x</button>
                                </div>
                            ))}

                            <input
                                type="text"
                                value={displayValue()}
                                placeholder={!tags.length ? 'Search...' : ''}
                                onChange={e => { setQuery(e.target.value); setValue(null) }}
                                ref={ref}
                                onClick={() => setOpen(!open)}
                            />

                        </div>

                    </div>
                    {
                        tags.length ? <div className='cross' onClick={() => setTags([])}>x</div> : null
                    }
                    <span className='vertical'></span>
                    <div className={`arrow ${open ? "open" : null}`}></div>
                </div>

                {/* drop down items*/}

                {/* {
                    status === 'loading' && (<div>Loading...</div>)
                }
                {
                    status === 'error' && (<div>Error fetching data</div>)
                }
                {
                    status === 'success' && (

                        <QueryClientProvider client={queryClient}> */}

                <div className={`options ${open ? "open" : null}`}>
                    {
                        filter(options).map(option => {
                            if (!tags.includes(option.name)) {
                                return (
                                    <div
                                        key={option.id}
                                        className={`option ${value === option ? "selected" : null}`}
                                        onClick={() => selectOption(option)}>
                                        {option.name}
                                    </div>)
                            }
                        })
                    }
                </div>

                {/* </QueryClientProvider>
                    )
                } */}
            </div>

        </>
    )
}

export default MultiSelectDropdown;


// const queryClient = new QueryClient({
//     defaultOptions: {
//       queries: {
//         refetchOnWindowFocus: true,
//         retry: 0
//         // refetchOnMount: false,
//         // refetchOnReconnect: false,
//         // suspense: true
//       },
//     },
//   });