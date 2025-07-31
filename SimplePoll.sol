// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SimplePoll {
    address public immutable i_owner;

    struct Proposal {
        string name;
        uint256 voteCount;
    }

    Proposal[] public proposals;

    mapping(address => bool) private hasVoted;
    uint256 public votingEndTime;
    bool public pollActive;

    error NotOwner();
    error NoProposalsYet();
    error PollAlreadyActive();
    error PollNotActive();
    error PollEnded();
    error AlreadyVoted();
    error InvalidProposalId();
    error PollNotEnded();
    error PollNotStarted();

    constructor() {
        i_owner = msg.sender;
        pollActive = false;
    }

    modifier onlyOwner() {
        if (msg.sender != i_owner) revert NotOwner();
        _;
    }

    modifier whenPollNotActive() {
        if (pollActive) revert PollAlreadyActive();
        _;
    }

    modifier whenPollActive() {
        if (!pollActive) revert PollNotActive();
        if (block.timestamp >= votingEndTime && votingEndTime != 0)
            revert PollEnded();
        _;
    }

    modifier whenPollEnded() {
        if (!pollActive) revert PollNotStarted();
        if (block.timestamp < votingEndTime) revert PollNotEnded();
        _;
    }

    function createProposal(
        string memory _name
    ) public onlyOwner whenPollNotActive {
        proposals.push(Proposal(_name, 0));
    }

    function startPoll(
        uint256 _durationMinutes
    ) public onlyOwner whenPollNotActive {
        if (proposals.length == 0) revert NoProposalsYet();

        votingEndTime = block.timestamp + (_durationMinutes * 1 minutes);
        pollActive = true;
    }

    function endPoll() public onlyOwner {
        if (!pollActive) revert PollNotStarted();

        pollActive = false;
    }

    function vote(uint256 _proposalId) public whenPollActive {
        if (_proposalId >= proposals.length) {
            revert InvalidProposalId();
        }
        if (hasVoted[msg.sender]) {
            revert AlreadyVoted();
        }

        proposals[_proposalId].voteCount++;
        hasVoted[msg.sender] = true;
    }

    function getProposalsCount() public view returns (uint256) {
        return proposals.length;
    }

    function getWinner()
        public
        view
        whenPollEnded
        returns (
            uint256 winningId,
            string memory winningName,
            uint256 winningVotes
        )
    {
        if (proposals.length == 0) {
            revert NoProposalsYet();
        }

        uint256 maxVotes = 0;
        uint256 winnerIndex = 0;

        for (uint256 i = 0; i < proposals.length; i++) {
            if (proposals[i].voteCount > maxVotes) {
                maxVotes = proposals[i].voteCount;
                winnerIndex = i;
            }
        }
        return (winnerIndex, proposals[winnerIndex].name, maxVotes);
    }
}
