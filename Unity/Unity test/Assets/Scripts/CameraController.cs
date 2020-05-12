using System.Collections;
using System.Collections.Generic;
using System.Collections.Specialized;
using UnityEngine;

public class CameraController : MonoBehaviour
{
    public GameObject player;
    public GameObject deathCountText;

    private Vector3 offset;


    // Use this for initialization
    void Start()
    {
        offset = transform.position - player.transform.position;
    }

    // LateUpdate is called after Update each frame
    void LateUpdate()
    {
        transform.position = player.transform.position + offset;
        deathCountText.transform.position = player.transform.position - (new Vector3(7, -7, 0));
    }
}
