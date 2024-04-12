import { Octokit } from '@octokit/rest';
import { useState, useEffect } from 'react';

import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';

import parseLinkHeader from './utils/parseLinkHeader';
import GistDetails from './components/GistDetails';
import GistRow from './components/GistRow';

import './App.css';

const octokit = new Octokit({
  auth: "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"
})

function App() {

  const [username, setUsername] = useState('');
  const [gists, setGists] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedGist, setSelectedGist] = useState({});

  const pageSize = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const [isLoading, setIsLoading] = useState(false);
  const [showGistList, setShowGistList] = useState(false);
  const [showGistDetails, setShowGistDetails] = useState(false);

  useEffect(() => {
    renderGistsList(gists, totalPages);
  }, [gists]);

  useEffect(() => {
    renderGistDetails(selectedGist);
  }, [selectedGist]);

  useEffect(() => {
    getGists();
  }, [currentPage]);

  function toggleDisplay() {
    setShowGistList((prev) => !prev);
    setShowGistDetails((prev) => !prev);
  }

  function getTotalPagesFromURL(url) {
    const urlObj = new URL(url);
    const params = new URLSearchParams(urlObj.search);
    return params.get('page');
  }

  async function getGists() {
    if (username.trim().length === 0) {
      // TODO: Add error handling UX
      return;
    }

    setIsLoading(true);

    const response = await octokit.request('GET /users/{username}/gists', {
      username,
      per_page: pageSize,
      page: currentPage
    });

    const { data, headers } = response;

    if (data.length === 0) {
      setIsLoading(false);
      return;
    } else {

      if (Object.keys(headers).includes('link')) {
        const linkHeader = parseLinkHeader(headers.link);
        if (Object.keys(linkHeader).includes('last')) {
          setTotalPages(parseInt(getTotalPagesFromURL(linkHeader.last)));
        }
      }

      setGists(data);
      setShowGistList(true);
      setShowGistDetails(false);
      setIsLoading(false);
    }
  }

  async function getSelectedGist(id) {
    const response = await octokit.request('GET /gists/{id}', { id });

    const { data } = response;

    if (data.length === 0) {
      return;
    } else {
      setSelectedGist(data);
      setShowGistDetails(true);
      setShowGistList(false);
    }
  }

  function renderGistsList(gists) {
    if (gists.length === 0) {
      return;
    } else if (isLoading) {
      return (
        <div className="gistList">
          <CircularProgress />
        </div>
      )
    } else {
      const isDisplayedClass = showGistList ? 'show' : 'hide';
      return (
        <div className={`gistList ${isDisplayedClass}`}>
          <TableContainer>
            <Table className="table">
              <TableHead className="table-header">
                <TableRow>
                  <th>Filename</th>
                  <th>Description</th>
                  <th>No. of Files</th>
                  <th>Languages</th>
                </TableRow>
              </TableHead>
              <TableBody className="hasSelectableRows">
                {gists.map((gist, index) => renderGistRow(gist, index))}
              </TableBody>
            </Table>
          </TableContainer>
          <Pagination shape="rounded" count={totalPages} page={currentPage} onChange={(e, value) => { setCurrentPage(value) }} />
        </div>
      );
    }
  }

  function renderGistRow(gist, index) {
    return (
      <GistRow key={index} details={gist} onClick={() => getSelectedGist(gist.id)} />
    )
  }

  function renderGistDetails(selectedGist) {
    const isDisplayedClass = showGistDetails ? ' show' : ' hide';
    return (
      <div className={`gistDetails ${isDisplayedClass}`}>
        <GistDetails selectedGist={selectedGist} toggleDisplay={toggleDisplay} />
      </div>
    )
  }

  return (
    <div className="App">
      <h1>Gist Viewer</h1>
      <div>
        <div className="userInput">
          <Stack direction="row" spacing={1}>
            <TextField
              label="Username"
              name="username"
              variant="outlined"
              onChange={e => setUsername(e.target.value)}
              data-testid="input-username"
            />
            <Button
              variant="contained"
              onClick={getGists}
              disabled={isLoading || username == ""}
              data-testid="button-getGists"
            >
              Get Gists
            </Button>
          </Stack>
        </div>
      </div>

      {renderGistsList(gists)}

      {renderGistDetails(selectedGist)}
    </div>

  );
}

export default App;
