import { useState, useRef, useEffect} from 'react';
import axios from 'axios';
import { useQuery } from 'react-query';
// import options from "../data.json";
import './multiSelectDropdown.css';

const MultiSelectDropdown = () => {

    const [tags, setTags] = useState([]);
    const [value, setValue] = useState('')
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const ref = useRef(null);

    const fetchData = async () => {
        const { data } = await axios.get('https://api.instantwebtools.net/v1/passenger?page=0&size=10');
        return data;
    };

    const { isLoading, isSuccess, error, isError, data: options } = useQuery("data", fetchData);

    useEffect(() => {
        document.addEventListener("click", close);
        return () => document.removeEventListener("click", close);
    }, []);

    function close(e) {
        setOpen(e && e.target === ref.current);
    }

    function filter(options) {
        return options.data.filter((option) => option.name.toLowerCase().indexOf(query.toLowerCase()) > -1);
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

                {isLoading && <p>...Loading user </p>}
                {isError && <p>{error.message}</p>}
                {isSuccess &&
                    (
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
                    )
                }
            </div>

        </>
    )
}

export default MultiSelectDropdown;


