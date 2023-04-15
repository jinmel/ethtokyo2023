// SPDX-License-Identifier: MIT

pragma solidity 0.8.10;

import {IReferenceModule} from '../../../interfaces/IReferenceModule.sol';
import {ModuleBase} from '../ModuleBase.sol';
import {FollowValidationModuleBase} from '../FollowValidationModuleBase.sol';
import {IERC721} from '@openzeppelin/contracts/token/ERC721/IERC721.sol';
import {Errors} from '../../libraries/Errors.sol';


/** @notice A struct containing the necessary data to verify the reference to
 * a publication is the checkpointUri.
 *
 * @param checkpointUri Endpoint URI to generate image given prompt.
*/

struct ModelCheckpointReferenceData {
  string checkpointUri;
  bool followerOnly;
  // TODO: Add zk verifier address to prove the validity of generated image whether it was
  // generated using the checkpoint inference endpoint uri. The endpoint URI should
  // return a proof.
}


/**
 * @title ModelCheckpointReferenceModule
 * @author Jinsuk Park / Bora Nam
 *
 * This module makes sure that the reference has a
 */
contract ModelCheckpointReferenceModule is FollowValidationModuleBase, IReferenceModule, ModuleBase {
    mapping(uint256 => mapping(uint256 => ModelCheckpointReferenceData))
        internal _dataByPublicationByProfile;

    constructor(address hub) ModuleBase(hub) {}

    /**
     * @dev There is nothing needed at initialization.
     */
    function initializeReferenceModule(
        uint256 profileId,
        uint256 pubId,
        bytes calldata data
    ) external override onlyHub returns (bytes memory) {
        (
            string checkpointUri,
            bool followerOnly
        ) = abi.decode(data, (string, bool));
        _dataByPublicationByProfile[profileId][pubId].checkpointUri = checkpointUri;
    }

    /**
     * @notice Validates that the commenting profile's owner is a follower.
     *
     * NOTE: We don't need to care what the pointed publication is in this context.
     */
    function processComment(
        uint256 profileId,
        uint256 profileIdPointed,
        uint256 pubIdPointed,
        bytes calldata data
    ) external view override {
        address commentCreator = IERC721(HUB).ownerOf(profileId);
        _checkFollowValidity(profileIdPointed, commentCreator);
        string checkpointUri = _dataByPublicationByProfile[profileId][pubId].checkpointUri;
        (string decodedCheckpointUri) = abi.decode(data, (string));
        if (decodedCheckpointUri != checkpointUri)
            revert Errors.ModuleDataMismatch();

        // TODO: Do proof verification here against the on chain prover address
        // to validate the generated image against the checkpoint.
    }

    /**
     * @notice Validates that the commenting profile's owner is a follower.
     *
     * NOTE: We don't need to care what the pointed publication is in this context.
     */
    function processMirror(
        uint256 profileId,
        uint256 profileIdPointed,
        uint256 pubIdPointed,
        bytes calldata data
    ) external view override {
        address mirrorCreator = IERC721(HUB).ownerOf(profileId);
        _checkFollowValidity(profileIdPointed, mirrorCreator);
        (string decodedCheckpointUri) = abi.decode(data, (string));
        if (decodedCheckpointUri != checkpointUri)
            revert Errors.ModuleDataMismatch();
        // TODO: Do proof verification here against the on chain prover address
        // to validate the generated image against the checkpoint.
    }

    function _validateProof(address verifier, bytes calldata data) {
        IProofVerifier(verifier).verify(data);
    }
}
