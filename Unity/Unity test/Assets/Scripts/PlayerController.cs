﻿using System.Collections;
using System.Collections.Generic;
using System.Collections.Specialized;
using UnityEngine;

public class PlayerController : MonoBehaviour
{
    public float maxSpeed = 2f;

    float moveX;
    float moveY;

    private bool facingLeft = false;
    bool isGrounded;

    private Animator animator;

    private Rigidbody2D rb2d;
    public GameObject pausePanel;
    public GameObject menuImage;
    public GameObject resumeButton;
    public GameObject resumeText;

    Vector3 Velocity;

    // Start is called before the first frame update
    void Start()
    {
        animator = GetComponent<Animator>();
        rb2d = GetComponent<Rigidbody2D>();
        moveY = rb2d.velocity.y;

    }

    // Update is called once per frame
    void Update()
    {
        float move = Input.GetAxis("Horizontal");

        moveX = move * maxSpeed;
        

        if (Input.GetKeyDown(KeyCode.Space) && isGrounded)
        {
            moveY = 5;
        }
        else
        {
            moveY = rb2d.velocity.y;
        }

        rb2d.velocity = new Vector3(moveX, moveY);

        if (move <= 0.1 && move >= -0.1)
        {
            if (isGrounded)
            {
                ResetRotation();
                animator.Play("idle");
            }
            else
            {
                FreezRotation();
                animator.Play("jump");
            }
        }
        else
        {
            if (isGrounded)
            {
                ResetRotation();
                animator.Play("run");
            }
            else
            {
                FreezRotation();
                animator.Play("jump");
            }
        }

        if (move < 0 && !facingLeft)
        {
            Flip();
        }
        else if (move > 0 && facingLeft)
        {
            Flip();
        }

        if(rb2d.transform.position.y <= -5)
        {
            PauseGame();
        }
    }

    void Flip()
    {
        facingLeft = !facingLeft;
        Vector3 scale = transform.localScale;
        scale.x *= -1;
        transform.localScale = scale;
    }

    void FreezRotation()
    {
        rb2d.constraints = RigidbodyConstraints2D.FreezeRotation;
    }

    void ResetRotation()
    {
        rb2d.constraints = RigidbodyConstraints2D.None;
    }


    void OnCollisionEnter2D(Collision2D col)
    {
        if (col.gameObject.tag == "ground")
        {
            Debug.Log("Collision enter");
            isGrounded = true;
        }
    }

    void OnCollisionExit2D(Collision2D col)
    {
        if (col.gameObject.tag == "ground")
        {
            Debug.Log("Collision exit");
            isGrounded = false;
        }
    }

    void PauseGame()
    {
        Time.timeScale = 0;
        menuImage.transform.position = rb2d.transform.position + new Vector3(0, 2, 0);
        resumeButton.transform.position = rb2d.transform.position + new Vector3(0, 2, 0);
        
        resumeText.transform.position = rb2d.transform.position + new Vector3(0, 2, 0);
        pausePanel.SetActive(true);
        //Disable scripts that still work while timescale is set to 0
    }

    void ContinueGame()
    {
        Time.timeScale = 1;
        pausePanel.SetActive(false);
        //enable the scripts again
    }
}
